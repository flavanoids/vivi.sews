# 🔒 Security Configuration Guide

This document outlines the security features implemented in Vivisews and provides recommendations for production deployments.

## 🛡️ Implemented Security Features

### Authentication Security

1. **Rate Limiting**
   - Login attempts limited to 5 per minute per IP
   - API endpoints limited to 30 requests per minute per IP
   - Configurable limits in the auth store

2. **Account Lockout**
   - Accounts locked for 15 minutes after 5 failed login attempts
   - Automatic unlock after lockout period
   - Admin can manually unlock accounts

3. **Password Security**
   - Minimum 6 character requirement
   - Password confirmation on change
   - Admin password reset capability

### Application Security

1. **Security Headers**
   - Content Security Policy (CSP)
   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin
   - Strict-Transport-Security (HSTS)

2. **Input Validation**
   - All user inputs validated
   - SQL injection prevention (client-side)
   - XSS protection through CSP

3. **Access Control**
   - Role-based access control (Admin/User)
   - User data isolation
   - Admin-only functions protected

### Infrastructure Security

1. **Docker Security**
   - Non-root user execution
   - Minimal base image (nginx:alpine)
   - Health checks implemented
   - Resource limits (configurable)

2. **Network Security**
   - Custom port (8473) to avoid conflicts
   - Firewall configuration included
   - Cloudflare Tunnel support for secure public access

## 🔧 Security Configuration

### Environment Variables

```env
# Security settings
NODE_ENV=production
VITE_APP_SECURE_COOKIES=true
VITE_APP_SESSION_TIMEOUT=3600
```

### Nginx Security Configuration

The included `nginx.conf` provides:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self';" always;
```

## 🚨 Production Security Recommendations

### 1. SSL/TLS Configuration

**For Nginx with Let's Encrypt:**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

**Update nginx.conf for HTTPS:**

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

### 2. Database Security

**For production, implement a proper database:**

```bash
# PostgreSQL example
docker run -d \
  --name postgres-vivisews \
  -e POSTGRES_DB=vivisews \
  -e POSTGRES_USER=vivisews \
  -e POSTGRES_PASSWORD=secure_password \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15
```

### 3. Backup Strategy

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/vivisews"

# Backup application data
docker exec vivisews-app tar czf - /usr/share/nginx/html > $BACKUP_DIR/app_$DATE.tar.gz

# Backup database (if using external DB)
# pg_dump -h localhost -U vivisews vivisews > $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### 4. Monitoring and Logging

**Install monitoring tools:**

```bash
# Install fail2ban for intrusion prevention
sudo apt install fail2ban

# Configure fail2ban for nginx
sudo tee /etc/fail2ban/jail.local <<EOF
[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 5. Firewall Hardening

```bash
# UFW configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 8473/tcp
sudo ufw enable

# Or with iptables
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8473 -j ACCEPT
sudo iptables -A INPUT -j DROP
```

### 6. User Management

**Change default credentials immediately:**

1. Login as admin
2. Go to User Profile
3. Change password
4. Consider creating additional admin accounts
5. Disable default admin account if not needed

### 7. Regular Security Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d

# Check for security vulnerabilities
npm audit
```

## 🔍 Security Testing

### 1. Vulnerability Scanning

```bash
# Install security scanning tools
sudo apt install lynis

# Run security audit
sudo lynis audit system

# Check Docker images
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image vivisews:latest
```

### 2. Penetration Testing

- Test rate limiting by attempting multiple login failures
- Verify account lockout functionality
- Test XSS protection with malicious inputs
- Check CSRF protection
- Verify proper session management

### 3. Log Analysis

```bash
# Monitor failed login attempts
sudo tail -f /var/log/nginx/access.log | grep " 401 "

# Check for suspicious activity
sudo grep "POST /login" /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -nr

# Monitor Docker logs
docker-compose logs -f | grep -i "error\|warn\|fail"
```

## 🚨 Incident Response

### 1. Security Breach Checklist

- [ ] Immediately change all admin passwords
- [ ] Review access logs for suspicious activity
- [ ] Check for unauthorized user accounts
- [ ] Verify data integrity
- [ ] Update security configurations
- [ ] Document the incident
- [ ] Consider legal reporting requirements

### 2. Recovery Procedures

```bash
# Emergency shutdown
docker-compose down

# Restore from backup
tar xzf backup_YYYYMMDD_HHMMSS.tar.gz -C /opt/vivisews/

# Restart with new security settings
docker-compose up -d
```

## 📞 Security Contacts

For security issues:
- Create a private issue in the repository
- Include detailed logs and error messages
- Do not post sensitive information publicly

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Nginx Security Headers](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
