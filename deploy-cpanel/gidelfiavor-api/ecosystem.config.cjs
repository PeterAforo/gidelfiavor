// PM2 Configuration for cPanel Node.js deployment
module.exports = {
  apps: [{
    name: 'gidelfiavor-api',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development',
      API_PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      API_PORT: 3001
    }
  }]
};
