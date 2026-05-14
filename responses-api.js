// Responses API converter
// Converts OpenAI Responses API format to/from Chat Completions format
// so all existing providers/upstream remain compatible.

import crypto from "node:crypto";

// Convert Responses API request body to Chat Completions format
export function responsesToCompletions(body) {
  const messages = [];

  // System instruction
  if (body.instructions) {
    messages.push({ role: "system", content: body.instructions });
  }

  // Convert input items to messages
  if (body.input) {
    if (typeof body.input === "string") {
      messages.push({ role: "user", content: body.input });
    } else if (Array.isArray(body.input)) {
      for (const item of body.input) {
        if (typeof item === "string") {
          messages.push({ role: "user", content: item });
        } else if (item.type === "message") {
          const msg = { role: item.role || "user" };
          if (typeof item.content === "string") {
            msg.content = item.content;
          } else if (Array.isArray(item.content)) {
            // Multi-part content
            const parts = item.content.map(convertInputContentPart);
            // If all parts are text, join them
            if (parts.every(p => p.type === "text")) {
              msg.content = parts.map(p => p.text).join("\n");
            } else {
              msg.content = parts;
            }
          }
          messages.push(msg);
        } else if (item.type === "item_reference") {
          // Skip references, not directly convertible
        }
      }
    }
  }

  // If no messages at all, add empty user message
  if (messages.length === 0 || (messages.length === 1 && messages[0].role === "system")) {
    messages.push({ role: "user", content: "" });
  }

  const completionsBody = {
    model: body.model,
    messages,
  };

  // Map common parameters
  if (body.temperature !== undefined) completionsBody.temperature = body.temperature;
  if (body.top_p !== undefined) completionsBody.top_p = body.top_p;
  if (body.max_output_tokens !== undefined) completionsBody.max_tokens = body.max_output_tokens;
  if (body.stop !== undefined) completionsBody.stop = body.stop;
  if (body.stream !== undefined) completionsBody.stream = body.stream;
  if (body.user !== undefined) completionsBody.user = body.user;

  // Tools conversion
  if (body.tools && body.tools.length > 0) {
    completionsBody.tools = body.tools
      .filter(t => t.type === "function")
      .map(t => ({
        type: "function",
        function: t.function || { name: t.name, description: t.description, parameters: t.parameters },
      }));
  }

  // Tool choice
  if (body.tool_choice) completionsBody.tool_choice = body.tool_choice;

  return completionsBody;
}

// Convert Chat Completions response to Responses API format
export function completionsToResponses(completionsResponse, requestBody) {
  const responseId = `resp_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
  const now = Math.floor(Date.now() / 1000);

  const output = [];
  const choice = completionsResponse.choices?.[0];

  if (choice?.message) {
    const msg = choice.message;

    // Handle tool calls
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      for (const tc of msg.tool_calls) {
        output.push({
          type: "function_call",
          id: tc.id || `call_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
          call_id: tc.id || `call_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
          name: tc.function.name,
          arguments: tc.function.arguments,
        });
      }
    }

    // Handle text content
    if (msg.content) {
      output.push({
        type: "message",
        id: `msg_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
        role: "assistant",
        content: [{ type: "output_text", text: msg.content }],
        status: "completed",
      });
    }
  }

  const response = {
    id: responseId,
    object: "response",
    created_at: now,
    status: "completed",
    model: completionsResponse.model || requestBody.model,
    output,
    usage: convertUsage(completionsResponse.usage),
  };

  // Include metadata if present
  if (requestBody.metadata) response.metadata = requestBody.metadata;

  return response;
}

// Convert streaming chat completions chunks to Responses API SSE events
export function convertStreamChunk(chunk, state) {
  const events = [];

  if (!state.started) {
    state.started = true;
    state.responseId = `resp_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
    state.itemId = `msg_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
    state.outputIndex = 0;
    state.contentIndex = 0;

    events.push({
      type: "response.created",
      response: {
        id: state.responseId,
        object: "response",
        status: "in_progress",
        model: state.model,
        output: [],
      },
    });

    events.push({ type: "response.in_progress" });

    events.push({
      type: "response.output_item.added",
      output_index: state.outputIndex,
      item: {
        type: "message",
        id: state.itemId,
        role: "assistant",
        content: [],
        status: "in_progress",
      },
    });

    events.push({
      type: "response.content_part.added",
      item_id: state.itemId,
      output_index: state.outputIndex,
      content_index: state.contentIndex,
      part: { type: "output_text", text: "" },
    });
  }

  const delta = chunk.choices?.[0]?.delta;
  if (delta?.content) {
    events.push({
      type: "response.output_text.delta",
      item_id: state.itemId,
      output_index: state.outputIndex,
      content_index: state.contentIndex,
      delta: delta.content,
    });
    state.fullText = (state.fullText || "") + delta.content;
  }

  const finishReason = chunk.choices?.[0]?.finish_reason;
  if (finishReason) {
    events.push({
      type: "response.output_text.done",
      item_id: state.itemId,
      output_index: state.outputIndex,
      content_index: state.contentIndex,
      text: state.fullText || "",
    });

    events.push({
      type: "response.content_part.done",
      item_id: state.itemId,
      output_index: state.outputIndex,
      content_index: state.contentIndex,
      part: { type: "output_text", text: state.fullText || "" },
    });

    events.push({
      type: "response.output_item.done",
      output_index: state.outputIndex,
      item: {
        type: "message",
        id: state.itemId,
        role: "assistant",
        content: [{ type: "output_text", text: state.fullText || "" }],
        status: "completed",
      },
    });

    events.push({
      type: "response.completed",
      response: {
        id: state.responseId,
        object: "response",
        status: "completed",
        model: state.model,
        output: [{
          type: "message",
          id: state.itemId,
          role: "assistant",
          content: [{ type: "output_text", text: state.fullText || "" }],
          status: "completed",
        }],
        usage: chunk.usage ? convertUsage(chunk.usage) : undefined,
      },
    });
  }

  return events;
}

// Format SSE event for Responses API streaming
export function formatSSE(event) {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

function convertInputContentPart(part) {
  if (typeof part === "string") return { type: "text", text: part };
  if (part.type === "input_text") return { type: "text", text: part.text };
  if (part.type === "input_image") {
    return { type: "image_url", image_url: { url: part.image_url || part.url } };
  }
  return { type: "text", text: part.text || "" };
}

function convertUsage(usage) {
  if (!usage) return undefined;
  return {
    input_tokens: usage.prompt_tokens || 0,
    output_tokens: usage.completion_tokens || 0,
    total_tokens: usage.total_tokens || 0,
  };
}
