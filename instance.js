import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const INSTANCE_FILE = "./data/instance.json";

function createInstanceManager() {
  let instance = null;

  function load() {
    try {
      if (fs.existsSync(INSTANCE_FILE)) {
        instance = JSON.parse(fs.readFileSync(INSTANCE_FILE, "utf8"));
      }
    } catch {
      instance = null;
    }
  }

  function save() {
    const dir = path.dirname(INSTANCE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tmp = `${INSTANCE_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(instance, null, 2), "utf8");
    fs.renameSync(tmp, INSTANCE_FILE);
    fs.chmodSync(INSTANCE_FILE, 0o600);
  }

  function init() {
    load();
    if (!instance) {
      instance = {
        id: crypto.randomUUID(),
        password: crypto.randomBytes(6).toString("base64url"),
        createdAt: Date.now(),
      };
      save();
    }
    return instance;
  }

  function getId() {
    return instance?.id || "unknown";
  }

  function getPassword() {
    return instance?.password || "";
  }

  return { init, getId, getPassword };
}

export const instanceManager = createInstanceManager();
