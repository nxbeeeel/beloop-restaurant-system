# 🚀 Deployment Guide - Beloop Restaurant Management System

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version
- **Memory**: Minimum 4GB RAM
- **Storage**: Minimum 10GB free space

### Operating Systems
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 20.04+
- ✅ CentOS 8+

## 🏗️ Production Deployment

### 1. Environment Setup

#### Clone Repository
```bash
git clone <repository-url>
cd beloop-restaurant-management
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
```bash
# Backend Environment
cp apps/backend/.env.example apps/backend/.env

# Edit backend environment variables
nano apps/backend/.env
```

**Backend Environment Variables:**
```env
# Server Configuration
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Database (when MongoDB is integrated)
MONGODB_URI=mongodb://localhost:27017/beloop-restaurant

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# File Storage (when S3 is integrated)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=beloop-restaurant-files
```

### 2. Build Applications

#### Build All Applications
```bash
# Build backend
cd apps/backend
npm run build

# Build admin dashboard
cd ../admin
npm run build

# Build POS system
cd ../pos
npm run build
```

#### Alternative: Build from Root
```bash
npm run build
```

### 3. Production Server Setup

#### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd apps/backend
pm2 start dist/index.js --name "beloop-backend"

# Start frontend servers (if needed)
cd ../admin
pm2 serve dist 3001 --name "beloop-admin"

cd ../pos
pm2 serve dist 3002 --name "beloop-pos"
```

#### Using Docker (Alternative)
```bash
# Build Docker images
docker build -t beloop-backend apps/backend/
docker build -t beloop-admin apps/admin/
docker build -t beloop-pos apps/pos/

# Run containers
docker run -d -p 5000:5000 --name beloop-backend beloop-backend
docker run -d -p 3001:3001 --name beloop-admin beloop-admin
docker run -d -p 3002:3002 --name beloop-pos beloop-pos
```

### 4. Reverse Proxy Setup (Nginx)

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/beloop-restaurant

server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Admin Dashboard
    location /admin/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # POS System
    location /pos/ {
        proxy_pass http://localhost:3002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health Check
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

#### Enable Site
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/beloop-restaurant /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 5. SSL Certificate Setup

#### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Using Commercial SSL
```bash
# Upload your certificate files
sudo cp your-certificate.crt /etc/ssl/certs/
sudo cp your-private-key.key /etc/ssl/private/

# Update Nginx configuration with correct paths
```

### 6. Database Setup (MongoDB)

#### Install MongoDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# CentOS/RHEL
sudo yum install mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Database Configuration
```bash
# Access MongoDB
mongo

# Create database and user
use beloop-restaurant
db.createUser({
  user: "beloop_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

### 7. Monitoring & Logging

#### PM2 Monitoring
```bash
# Monitor applications
pm2 monit

# View logs
pm2 logs

# Status
pm2 status
```

#### Log Rotation
```bash
# Configure log rotation
sudo nano /etc/logrotate.d/beloop-restaurant

# Add configuration
/var/log/beloop-restaurant/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

### 8. Backup Strategy

#### Database Backup
```bash
# Create backup script
nano /opt/backup-db.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mongodump --db beloop-restaurant --out $BACKUP_DIR/db_$DATE
tar -czf $BACKUP_DIR/db_$DATE.tar.gz $BACKUP_DIR/db_$DATE
rm -rf $BACKUP_DIR/db_$DATE

# Make executable
chmod +x /opt/backup-db.sh

# Add to crontab (daily backup at 2 AM)
0 2 * * * /opt/backup-db.sh
```

#### Application Backup
```bash
# Backup application files
tar -czf /opt/backups/app_$(date +%Y%m%d_%H%M%S).tar.gz /opt/beloop-restaurant-management/
```

### 9. Security Hardening

#### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Firewalld (CentOS)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

#### Fail2ban Setup
```bash
# Install Fail2ban
sudo apt install fail2ban

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 10. Performance Optimization

#### Nginx Optimization
```nginx
# Add to nginx.conf
worker_processes auto;
worker_connections 1024;

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

#### Node.js Optimization
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Use PM2 cluster mode
pm2 start dist/index.js --name "beloop-backend" -i max
```

## 📱 Mobile App Deployment

### Android App
```bash
# Build Android app
cd apps/pos
npm run build:android

# Generate APK
npx cap build android
```

### iOS App
```bash
# Build iOS app
cd apps/pos
npm run build:ios

# Open in Xcode
npx cap open ios
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /opt/beloop-restaurant-management
            git pull
            npm install
            npm run build
            pm2 restart all
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
sudo netstat -tulpn | grep :5000

# Kill process
sudo kill -9 <PID>
```

#### Permission Denied
```bash
# Fix file permissions
sudo chown -R $USER:$USER /opt/beloop-restaurant-management
sudo chmod -R 755 /opt/beloop-restaurant-management
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongo --eval "db.runCommand('ping')"
```

### Health Checks
```bash
# API Health
curl https://yourdomain.com/health

# Application Status
pm2 status

# Nginx Status
sudo systemctl status nginx
```

## 📞 Support

For deployment support:
- **Email**: support@beloop.com
- **Documentation**: [docs.beloop.com](https://docs.beloop.com)
- **Emergency**: +91-XXXXXXXXXX

---

**Deployment completed successfully! 🎉**
