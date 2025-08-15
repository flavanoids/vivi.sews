# 🧵 Vivisews

A sewing project management app built to keep track of fabric stash, patterns, and projects. It's a React app with a clean interface that works great on both desktop and mobile.

## 👨‍💻 Created by

**Noe Pineda** - Built with ❤️ for my wife

### 🤖 Built with Cursor

This project was developed using [Cursor](https://cursor.sh), an AI-powered code editor that helped accelerate development and improve code quality.

---

## What it does

- **Track your projects** - Keep notes on what you're working on, materials used, and progress
- **Organize patterns** - Store and categorize your sewing patterns with photos and notes
- **Manage fabric** - Log your fabric stash with details like yardage, fiber content, and cost
- **User accounts** - Multiple people can use it with their own separate data
- **Admin panel** - Manage users and system settings if you're running it for a group

## Security stuff

I've added some basic security features since this could be used by multiple people:
- Rate limiting on login attempts (5 tries per minute)
- Account lockout after too many failed attempts (15 minutes)
- Secure headers to prevent common web attacks
- Input validation to keep things clean

## Getting it running

### Option 1: Docker (easiest)

You'll need Docker and Docker Compose installed.

1. **Get the code**
   ```bash
   git clone <repository-url>
   cd vivisews
   ```

2. **Start it up**
   ```bash
   docker-compose up -d
   ```

3. **Open in your browser**
   - On your computer: http://localhost:8473
   - From other devices on your network: http://your-computer-ip:8473

**Useful Docker commands:**
```bash
# Start the app
docker-compose up -d

# See what's happening
docker-compose logs -f

# Stop it
docker-compose down

# Update and restart
docker-compose up -d --build
```

### Option 2: Install on your server

This is for when you want to run it on a Linux server (Ubuntu, Debian, CentOS, etc.).

**What you need:**
- Node.js 18+ and npm
- Docker and Docker Compose
- A Linux system

**Quick install:**
1. **Get the code**
   ```bash
   git clone <repository-url>
   cd vivisews
   ```

2. **Install Docker (if you don't have it)**
   ```bash
   chmod +x scripts/install-docker.sh
   ./scripts/install-docker.sh
   ```

3. **Deploy it**
   ```bash
   chmod +x scripts/build.sh
   ./scripts/build.sh
   ```

**Manual install (if you prefer):**
1. **Install dependencies**
   ```bash
   npm ci
   ```

2. **Build it**
   ```bash
   npm run build
   ```

3. **Set up Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/vivisews
   sudo ln -s /etc/nginx/sites-available/vivisews /etc/nginx/sites-enabled/
   sudo systemctl reload nginx
   ```

4. **Open the firewall port**
   ```bash
   # For UFW
   sudo ufw allow 8473/tcp
   
   # For Firewalld
   sudo firewall-cmd --permanent --add-port=8473/tcp
   sudo firewall-cmd --reload
   ```

## Making it accessible on your network

The app runs on port **8473** by default. To access it from other devices on your network:

1. **Find your computer's IP address**
   ```bash
   hostname -I
   ```

2. **Access from other devices**
   ```
   http://your-computer-ip:8473
   ```

## Making it accessible on the web (optional)

If you want to access it from anywhere on the internet, you can use Cloudflare Tunnel. This is more secure than opening ports directly.

1. **Install Cloudflare Tunnel**
   ```bash
   # Download cloudflared
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. **Set up with Cloudflare**
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create vivisews
   ```

3. **Configure it**
   Create `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: <your-tunnel-id>
   credentials-file: ~/.cloudflared/<your-tunnel-id>.json
   
   ingress:
     - hostname: vivisews.yourdomain.com
       service: http://localhost:8473
     - service: http_status:404
   ```

4. **Start the tunnel**
   ```bash
   cloudflared tunnel run vivisews
   ```

5. **Set up your domain**
   - Go to your Cloudflare dashboard
   - Add a CNAME record pointing to `<your-tunnel-id>.cfargotunnel.com`

6. **Make it start automatically**
   ```bash
   sudo cloudflared service install
   ```

## Configuration

### Environment variables

You can create a `.env` file in the project root to customize things:

```env
NODE_ENV=production
VITE_APP_TITLE=Vivisews
VITE_APP_VERSION=1.0.0
```

### Nginx setup

The app comes with a pre-configured Nginx setup that includes:
- Security headers to prevent attacks
- Rate limiting on login attempts
- Gzip compression for faster loading
- Static file caching

### Changing the port

If you want to use a different port instead of 8473:

1. **Update Docker Compose**
   ```yaml
   ports:
     - "your-port:8473"
   ```

2. **Update Nginx**
   ```nginx
   listen your-port;
   ```

3. **Update firewall**
   ```bash
   sudo ufw allow your-port/tcp
   ```

## Default login

**Admin account:**
- Username: `ADMIN`
- Password: `pineda0322`

**⚠️ Change this password right away after you first log in!**

## Development

**What you need:**
- Node.js 18+
- npm

**Getting started:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Check code quality
npm run lint
```

**Project structure:**
```
vivisews/
├── src/
│   ├── components/     # UI components
│   ├── pages/         # Page components
│   ├── store/         # State management
│   ├── contexts/      # React contexts
│   └── locales/       # Translations
├── scripts/           # Build scripts
├── Dockerfile         # Docker setup
├── docker-compose.yml # Docker config
└── nginx.conf         # Nginx config
```

## Troubleshooting

### Common problems

1. **Port is already in use**
   ```bash
   # See what's using the port
   sudo netstat -tulpn | grep 8473
   
   # Kill the process or use a different port
   ```

2. **Permission errors**
   ```bash
   # Fix script permissions
   chmod +x scripts/*.sh
   
   # Fix Docker permissions
   sudo usermod -aG docker $USER
   # Log out and log back in
   ```

3. **Service won't start**
   ```bash
   # Check if it's running
   sudo systemctl status vivisews
   
   # See the logs
   sudo journalctl -u vivisews -f
   ```

4. **Docker build fails**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Try building again
   docker-compose build --no-cache
   ```

### Where to find logs

- **Docker logs**: `docker-compose logs -f`
- **System logs**: `sudo journalctl -u vivisews -f`
- **Nginx logs**: `sudo tail -f /var/log/nginx/access.log`

## License

MIT License - feel free to use this however you want.

## Contributing

If you want to help improve this:
1. Fork the repo
2. Make your changes
3. Send a pull request

## Getting help

If something's not working:
- Check the troubleshooting section above
- Look at the logs to see what's going wrong
- Create an issue in the repo if you're still stuck

---

**Note**: This is designed for personal use and small groups. If you're planning to use it for a larger organization, you might want to add things like:
- SSL certificates
- A proper database
- Better user management
- Backup systems
- Monitoring tools
