#!/bin/bash

# Vivisews Build Script
# This script builds and deploys Vivisews on a Linux system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="vivisews"
APP_PORT="8473"
SERVICE_USER="vivisews"
SERVICE_GROUP="vivisews"
INSTALL_DIR="/opt/vivisews"
SERVICE_FILE="/etc/systemd/system/vivisews.service"

echo -e "${BLUE}🧵 Vivisews Build and Installation Script${NC}"
echo "================================================"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Check if required tools are installed
check_dependencies() {
    print_status "Checking system dependencies..."
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    print_status "All dependencies are installed."
}

# Build the application
build_app() {
    print_status "Building Vivisews application..."
    
    # Install dependencies
    npm ci
    
    # Build the application
    npm run build
    
    print_status "Application built successfully."
}

# Create system user and directories
setup_system() {
    print_status "Setting up system user and directories..."
    
    # Create user and group if they don't exist
    if ! id "$SERVICE_USER" &>/dev/null; then
        sudo useradd -r -s /bin/false -d "$INSTALL_DIR" "$SERVICE_USER"
        print_status "Created user: $SERVICE_USER"
    fi
    
    # Create installation directory
    sudo mkdir -p "$INSTALL_DIR"
    sudo chown "$SERVICE_USER:$SERVICE_GROUP" "$INSTALL_DIR"
    
    print_status "System setup completed."
}

# Deploy the application
deploy_app() {
    print_status "Deploying application..."
    
    # Copy built files
    sudo cp -r dist/* "$INSTALL_DIR/"
    sudo chown -R "$SERVICE_USER:$SERVICE_GROUP" "$INSTALL_DIR"
    
    # Copy nginx configuration
    sudo cp nginx.conf "$INSTALL_DIR/"
    
    print_status "Application deployed to $INSTALL_DIR"
}

# Create systemd service
create_service() {
    print_status "Creating systemd service..."
    
    sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Vivisews Web Application
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_GROUP
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/docker run --rm \\
    --name vivisews-app \\
    --user 1001:1001 \\
    -p $APP_PORT:$APP_PORT \\
    -v $INSTALL_DIR:/usr/share/nginx/html:ro \\
    -v $INSTALL_DIR/nginx.conf:/etc/nginx/nginx.conf:ro \\
    nginx:alpine
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable vivisews
    
    print_status "Systemd service created and enabled."
}

# Configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    # Detect firewall type
    if command -v ufw &> /dev/null; then
        sudo ufw allow $APP_PORT/tcp
        print_status "UFW firewall configured for port $APP_PORT"
    elif command -v firewall-cmd &> /dev/null; then
        sudo firewall-cmd --permanent --add-port=$APP_PORT/tcp
        sudo firewall-cmd --reload
        print_status "Firewalld configured for port $APP_PORT"
    elif command -v iptables &> /dev/null; then
        sudo iptables -A INPUT -p tcp --dport $APP_PORT -j ACCEPT
        print_warning "iptables rule added. Please save your iptables configuration."
    else
        print_warning "No supported firewall detected. Please manually open port $APP_PORT"
    fi
}

# Start the service
start_service() {
    print_status "Starting Vivisews service..."
    
    sudo systemctl start vivisews
    
    # Wait a moment for the service to start
    sleep 5
    
    # Check if service is running
    if sudo systemctl is-active --quiet vivisews; then
        print_status "Vivisews service started successfully!"
    else
        print_error "Failed to start Vivisews service. Check logs with: sudo journalctl -u vivisews"
        exit 1
    fi
}

# Main execution
main() {
    check_dependencies
    build_app
    setup_system
    deploy_app
    create_service
    configure_firewall
    start_service
    
    echo ""
    echo -e "${GREEN}🎉 Vivisews has been successfully installed and started!${NC}"
    echo ""
    echo -e "${BLUE}Access your application at:${NC}"
    echo -e "  Local: http://localhost:$APP_PORT"
    echo -e "  Network: http://$(hostname -I | awk '{print $1}'):$APP_PORT"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "  Check status: sudo systemctl status vivisews"
    echo -e "  View logs: sudo journalctl -u vivisews -f"
    echo -e "  Restart: sudo systemctl restart vivisews"
    echo -e "  Stop: sudo systemctl stop vivisews"
    echo ""
    echo -e "${YELLOW}Default admin credentials:${NC}"
    echo -e "  Username: ADMIN"
    echo -e "  Password: ADMIN"
    echo -e "${YELLOW}⚠️  IMPORTANT: Change the default password after first login!${NC}"
}

# Run main function
main "$@"
