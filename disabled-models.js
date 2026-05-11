import fs from "fs";
import path from "path";

const DISABLED_MODELS_FILE = "./data/disabled-models.json";

class DisabledModelsManager {
  constructor() {
    this.disabledModels = new Set();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DISABLED_MODELS_FILE)) {
        const data = fs.readFileSync(DISABLED_MODELS_FILE, "utf8");
        const models = JSON.parse(data);
        this.disabledModels = new Set(models);
      }
    } catch (err) {
      console.error("Failed to load disabled models:", err.message);
      this.disabledModels = new Set();
    }
  }

  save() {
    try {
      const dir = path.dirname(DISABLED_MODELS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        DISABLED_MODELS_FILE,
        JSON.stringify([...this.disabledModels], null, 2),
        "utf8"
      );
      // Set file permissions to 600 (owner read/write only)
      fs.chmodSync(DISABLED_MODELS_FILE, 0o600);
    } catch (err) {
      console.error("Failed to save disabled models:", err.message);
    }
  }

  isDisabled(modelId) {
    return this.disabledModels.has(modelId);
  }

  disable(modelId) {
    this.disabledModels.add(modelId);
    this.save();
  }

  enable(modelId) {
    this.disabledModels.delete(modelId);
    this.save();
  }

  getAll() {
    return [...this.disabledModels];
  }
}

export const disabledModelsManager = new DisabledModelsManager();
