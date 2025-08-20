# 🧵 Vivisews

A comprehensive sewing project management application designed to track fabric inventory, pattern collections, and project workflows. Built with React and TypeScript, featuring a responsive interface optimized for both desktop and mobile environments.

## 🚀 New Features (Development Branch)

- **Persistent Data Storage**: All user data is now stored in PostgreSQL database
- **Cross-Device Sync**: Access your fabrics from any device (mobile, desktop, remote)
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **RESTful API**: Backend API for reliable data management
- **Docker Support**: Separate development and production environments

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
- **Data Persistence** - PostgreSQL database ensures all data persists across container updates and restarts

## Security Implementation

The application implements several security measures for multi-user environments:
- Rate limiting on authentication attempts (5 attempts per minute)
- Account lockout mechanism after excessive failed attempts (15-minute duration)
- Security headers implementation to prevent common web vulnerabilities
- Comprehensive input validation and sanitization

## Data Persistence

### Database Setup

Vivisews uses **PostgreSQL** for persistent data storage, ensuring that all user data, fabrics, projects, and patterns are preserved across container updates and restarts.

**What's Persisted:**
- ✅ User accounts and authentication data
- ✅ Fabric inventory and usage history
- ✅ Project details and materials
- ✅ Pattern collections
- ✅ Application settings and preferences

**Database Volumes:**
- **Development**: `postgres_data_dev` - Local PostgreSQL data
- **Production**: `postgres_data` - Production PostgreSQL data

### Backup and Recovery

**Development Backups:**
```bash
# Create backup
./scripts/dev.sh backup

# Restore from backup
./scripts/dev.sh restore <backup_file>
```

**Production Backups:**
```bash
# Create full backup (database + application)
./scripts/backup.sh full

# Create database-only backup
./scripts/backup.sh database

# List available backups
./scripts/backup.sh list

# Restore from backup
./scripts/backup.sh restore <backup_file>

# Clean up old backups (30+ days)
./scripts/backup.sh cleanup
```

### Database Management

**Development Database Access:**
```bash
# Connect to PostgreSQL
./scripts/dev.sh db

# View database logs
docker-compose -f docker-compose.dev.yml logs postgres
```

**Production Database Access:**
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U vivisews -d vivisews

# View database logs
docker-compose logs postgres
```

## Installation

### Option 1: Docker Deployment (Recommended)

Prerequisites: Docker and Docker Compose

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd vivisews
   ```

2. **Switch to Development Branch (for new features)**
   ```bash
   git checkout development
   ```

3. **Deploy Application**
   ```bash
   # For development environment
   docker-compose -f docker-compose.dev.yml up -d
   
   # For production environment
   docker-compose up -d
   ```

4. **Access Application**
   - Development: http://localhost:5173 (Frontend) / http://localhost:3001 (API)
   - Production: http://localhost:8473 (Frontend) / http://localhost:3001 (API)
   - Database: localhost:5432

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
DATABASE_URL=postgresql://vivisews:vivisews_prod_password@postgres:5432/vivisews
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

**⚠️ Security Notice: Change default credentials immediately after initial login**

## Development Environment

**Prerequisites:**
- Docker and Docker Compose

**Development Workflow:**
```bash
# Start development environment
./scripts/dev.sh start

# View development logs
./scripts/dev.sh logs

# Stop development environment
./scripts/dev.sh stop

# Restart development environment
./scripts/dev.sh restart

# Access container shell
./scripts/dev.sh shell

# Access database
./scripts/dev.sh db

# Rebuild development container
./scripts/dev.sh build

# Clean up development environment
./scripts/dev.sh clean
```

**Development Features:**
- Hot reloading with Vite development server
- PostgreSQL database with persistent storage
- Database backup and restore functionality
- Container health checks and monitoring

## Troubleshooting

### Database Connection Issues

If the application can't connect to the database:

1. **Check if PostgreSQL is running:**
   ```bash
   docker-compose ps postgres
   ```

2. **View database logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Restart the database:**
   ```bash
   docker-compose restart postgres
   ```

### Data Loss Prevention

To prevent data loss during updates:

1. **Always backup before major changes:**
   ```bash
   ./scripts/backup.sh full
   ```

2. **Use the development environment for testing:**
   ```bash
   ./scripts/dev.sh start
   ```

3. **Never use `docker-compose down -v` in production** (this deletes volumes)

### Performance Issues

If the application is slow:

1. **Check database performance:**
   ```bash
   docker-compose exec postgres psql -U vivisews -d vivisews -c "SELECT * FROM pg_stat_activity;"
   ```

2. **Monitor resource usage:**
   ```bash
   docker stats
   ```

3. **Check application logs:**
   ```bash
   docker-compose logs vivisews
   ```

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
