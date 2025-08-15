# 🧵 Vivisews

A comprehensive sewing project management application designed to track fabric inventory, pattern collections, and project workflows. Built with React and TypeScript, featuring a responsive interface optimized for both desktop and mobile environments.

## 👨‍💻 Created by

**Noe Pineda** - Built with ❤️ for my wife

### 🤖 Built with Cursor

This project was developed using [Cursor](https://cursor.sh), an AI-powered code editor that helped accelerate development and improve code quality.

---

## Features

- **Project Management** - Comprehensive tracking of sewing projects with material usage, progress monitoring, and detailed notes
- **Pattern Organization** - Digital catalog system for sewing patterns with metadata, photos, and categorization
- **Fabric Inventory** - Detailed fabric management with yardage tracking, fiber content analysis, and cost monitoring
- **Multi-User Support** - Isolated user accounts with separate data storage and access controls
- **Administrative Interface** - User management and system configuration for multi-user deployments

## Security Implementation

The application implements several security measures for multi-user environments:
- Rate limiting on authentication attempts (5 attempts per minute)
- Account lockout mechanism after excessive failed attempts (15-minute duration)
- Security headers implementation to prevent common web vulnerabilities
- Comprehensive input validation and sanitization

## Installation

### Option 1: Docker Deployment (Recommended)

Prerequisites: Docker and Docker Compose

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd vivisews
   ```

2. **Deploy Application**
   ```bash
   docker-compose up -d
   ```

3. **Access Application**
   - Local access: http://localhost:8473
   - Network access: http://your-server-ip:8473

**Docker Management Commands:**
```bash
# Start application
docker-compose up -d

# Monitor logs
docker-compose logs -f

# Stop application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Option 2: Server Installation

For production deployments on Linux servers (Ubuntu, Debian, CentOS, etc.).

**System Requirements:**
- Node.js 18+ and npm
- Docker and Docker Compose
- Linux operating system

**Automated Installation:**
1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd vivisews
   ```

2. **Install Docker Dependencies**
   ```bash
   chmod +x scripts/install-docker.sh
   ./scripts/install-docker.sh
   ```

3. **Deploy Application**
   ```bash
   chmod +x scripts/build.sh
   ./scripts/build.sh
   ```

**Manual Installation:**
1. **Install Dependencies**
   ```bash
   npm ci
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Configure Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/vivisews
   sudo ln -s /etc/nginx/sites-available/vivisews /etc/nginx/sites-enabled/
   sudo systemctl reload nginx
   ```

4. **Configure Firewall**
   ```bash
   # UFW Configuration
   sudo ufw allow 8473/tcp
   
   # Firewalld Configuration
   sudo firewall-cmd --permanent --add-port=8473/tcp
   sudo firewall-cmd --reload
   ```

## Network Configuration

The application operates on port **8473** by default. For network accessibility:

1. **Determine Server IP Address**
   ```bash
   hostname -I
   ```

2. **Access from Network Devices**
   ```
   http://your-server-ip:8473
   ```

## Internet Accessibility (Optional)

For external access, Cloudflare Tunnel provides secure connectivity without direct port exposure.

1. **Install Cloudflare Tunnel**
   ```bash
   # Download cloudflared binary
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. **Initialize Tunnel**
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create vivisews
   ```

3. **Configure Tunnel**
   Create `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: <your-tunnel-id>
   credentials-file: ~/.cloudflared/<your-tunnel-id>.json
   
   ingress:
     - hostname: vivisews.yourdomain.com
       service: http://localhost:8473
     - service: http_status:404
   ```

4. **Start Tunnel Service**
   ```bash
   cloudflared tunnel run vivisews
   ```

5. **Configure DNS**
   - Access Cloudflare dashboard
   - Create CNAME record pointing to `<your-tunnel-id>.cfargotunnel.com`

6. **Enable Auto-start**
   ```bash
   sudo cloudflared service install
   ```

## Configuration

### Environment Variables

Create a `.env` file in the project root for customization:

```env
NODE_ENV=production
VITE_APP_TITLE=Vivisews
VITE_APP_VERSION=1.0.0
```

### Nginx Configuration

The application includes a pre-configured Nginx setup with:
- Security headers for vulnerability prevention
- Rate limiting for authentication endpoints
- Gzip compression for performance optimization
- Static file caching for improved load times

### Port Configuration

To modify the default port (8473):

1. **Update Docker Compose Configuration**
   ```yaml
   ports:
     - "your-port:8473"
   ```

2. **Update Nginx Configuration**
   ```nginx
   listen your-port;
   ```

3. **Update Firewall Rules**
   ```bash
   sudo ufw allow your-port/tcp
   ```

## Authentication

**Default Administrator Account:**
- Username: `ADMIN`
- Password: `ADMIN`

**⚠️ Security Notice: Change default credentials immediately after initial login**

## Development Environment

**Prerequisites:**
- Node.js 18+
- npm

**Development Workflow:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Execute linting
npm run lint
```

**Project Architecture:**
```
vivisews/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route-based page components
│   ├── store/         # State management (Zustand)
│   ├── contexts/      # React context providers
│   └── locales/       # Internationalization
├── scripts/           # Deployment and build scripts
├── Dockerfile         # Container configuration
├── docker-compose.yml # Orchestration configuration
└── nginx.conf         # Web server configuration
```

## Troubleshooting

### Common Issues

1. **Port Conflict Resolution**
   ```bash
   # Identify port usage
   sudo netstat -tulpn | grep 8473
   
   # Resolve conflict or configure alternative port
   ```

2. **Permission Resolution**
   ```bash
   # Fix script permissions
   chmod +x scripts/*.sh
   
   # Configure Docker permissions
   sudo usermod -aG docker $USER
   # Re-authenticate user session
   ```

3. **Service Status Verification**
   ```bash
   # Check service status
   sudo systemctl status vivisews
   
   # Monitor service logs
   sudo journalctl -u vivisews -f
   ```

4. **Docker Build Resolution**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Log Monitoring

- **Docker Logs**: `docker-compose logs -f`
- **System Logs**: `sudo journalctl -u vivisews -f`
- **Nginx Logs**: `sudo tail -f /var/log/nginx/access.log`

## License

MIT License - Open source software available for modification and distribution.

## Contributing

Development contributions are welcome:
1. Fork the repository
2. Implement your changes
3. Submit a pull request

## Support

For technical issues:
- Review the troubleshooting section above
- Examine application logs for error details
- Create an issue in the repository for unresolved problems

---

**Deployment Note**: This application is optimized for personal use and small-scale deployments. For enterprise environments, consider implementing:
- SSL/TLS certificate management
- Database persistence layer
- Enhanced user management system
- Automated backup procedures
- Application monitoring and alerting
