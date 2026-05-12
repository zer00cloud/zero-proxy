import http from "node:http";

const PORT = 8787;
const HOST = "localhost";

// All 16 models
const models = [
  "minimax-m2.5-free",
  "big-pickle",
  "nemotron-3-super-free",
  "glm-4.7-free",
  "kimi-k2.5-free",
  "glm-5-free",
  "minimax-m2.1-free",
  "qwen3.6-plus-free",
  "ling-2.6-flash-free",
  "grok-code",
  "mimo-v2-flash-free",
  "hy3-preview-free",
  "mimo-v2-pro-free",
  "mimo-v2-omni-free",
  "ring-2.6-1t-free",
  "trinity-large-preview-free"
];

async function testModel(modelId) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 10
    });

    const options = {
      hostname: HOST,
      port: PORT,
      path: `/v1/${modelId}/chat/completions`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${modelId}: Success`);
          resolve({ model: modelId, success: true });
        } else {
          console.log(`❌ ${modelId}: Failed (${res.statusCode})`);
          resolve({ model: modelId, success: false });
        }
      });
    });

    req.on("error", (err) => {
      console.log(`❌ ${modelId}: Error - ${err.message}`);
      resolve({ model: modelId, success: false });
    });

    req.setTimeout(15000, () => {
      req.destroy();
      console.log(`⏱️  ${modelId}: Timeout`);
      resolve({ model: modelId, success: false });
    });

    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log("🚀 Starting model tests...\n");

  // Test each model 3-5 times with random count
  for (const model of models) {
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 requests per model
    console.log(`\n📊 Testing ${model} (${count} requests)...`);

    for (let i = 0; i < count; i++) {
      await testModel(model);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log("\n✨ All tests completed!");
  console.log("📈 Check dashboard at http://localhost:8787/dashboard");
}

runTests().catch(console.error);
