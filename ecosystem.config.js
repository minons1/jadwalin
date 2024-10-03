module.exports = {
  apps: [{
    name: "jadwalin",
    script: "yarn",
    args: "start",
    wait_ready: true,
    autorestart: true,
    max_restarts: 5 ,
    env: {
      NODE_ENV: "production",
    }
  }]
}