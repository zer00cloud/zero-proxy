import http from "node:http";

const PORT = 8787;
const HOST = "localhost";

// Models that work (based on previous test)
const workingModels = [
  "minimax-m2.5-free",
  "big-pickle",
  "nemotron-3-super-free",
  "ring-2.6-1t-free"
];

async function testModel(modelId) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 20
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
  console.log("🚀 Testing working models to generate more data...\n");

  // Test each working model 10 times
  for (let round = 1; round <= 10; round++) {
    console.log(`\n🔄 Round ${round}/10`);

    for (const model of workingModels) {
      await testModel(model);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  console.log("\n✨ All tests completed!");
  console.log("📈 Check dashboard at http://localhost:8787/dashboard");
}

runTests().catch(console.error);
