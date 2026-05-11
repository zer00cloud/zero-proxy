module.exports = {
  apps: [
    {
      name: "zen-proxy",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 8787,
        HOST: "0.0.0.0",
      },
      max_memory_restart: "200M",
      autorestart: true,
      watch: false,
    },
  ],
};
