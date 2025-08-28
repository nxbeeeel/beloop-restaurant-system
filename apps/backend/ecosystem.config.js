module.exports = {
  apps: [
    {
      name: 'beloop-backend',
      script: 'server.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      // Performance optimizations
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      // Auto-restart on file changes (development)
      watch: process.env.NODE_ENV === 'development' ? ['server.js'] : false,
      ignore_watch: ['node_modules', 'logs'],
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Health checks
      health_check_grace_period: 3000,
      // Restart policy
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      // Monitoring
      pmx: true,
      // Kill timeout
      kill_timeout: 5000,
      // Listen timeout
      listen_timeout: 8000
    }
  ],
  
  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/beloop-restaurant.git',
      path: '/var/www/beloop-restaurant',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
