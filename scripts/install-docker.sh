#!/bin/bash

# Docker Installation Script for Vivisews
# Supports Debian, Ubuntu, CentOS, RHEL, Fedora

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detect OS
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "Cannot detect OS. Please install Docker manually."
        exit 1
    fi
}

# Install Docker on Debian/Ubuntu
install_docker_debian() {
    print_status "Installing Docker on Debian/Ubuntu..."
    
    # Update package index
    sudo apt-get update
    
    # Install prerequisites
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package index again
    sudo apt-get update
    
    # Install Docker
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    print_status "Docker installed successfully on Debian/Ubuntu"
}

# Install Docker on CentOS/RHEL
install_docker_centos() {
    print_status "Installing Docker on CentOS/RHEL..."
    
    # Install prerequisites
    sudo yum install -y yum-utils
    
    # Add Docker repository
    sudo yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo
    
    # Install Docker
    sudo yum install -y docker-ce docker-ce-cli containerd.io
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    print_status "Docker installed successfully on CentOS/RHEL"
}

# Install Docker on Fedora
install_docker_fedora() {
    print_status "Installing Docker on Fedora..."
    
    # Install Docker
    sudo dnf install -y docker-ce docker-ce-cli containerd.io
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    print_status "Docker installed successfully on Fedora"
}

# Install Docker Compose
install_docker_compose() {
    print_status "Installing Docker Compose..."
    
    # Download Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Make it executable
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Create symlink
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    print_status "Docker Compose installed successfully"
}

# Main installation function
main() {
    echo -e "${BLUE}🐳 Docker Installation Script for Vivisews${NC}"
    echo "============================================="
    
    # Check if Docker is already installed
    if command -v docker &> /dev/null; then
        print_warning "Docker is already installed."
        read -p "Do you want to continue with Docker Compose installation? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_docker_compose
            print_status "Installation completed!"
            return
        else
            print_status "Installation cancelled."
            exit 0
        fi
    fi
    
    # Detect OS and install Docker
    detect_os
    
    case $OS in
        *"Ubuntu"*|*"Debian"*)
            install_docker_debian
            ;;
        *"CentOS"*|*"Red Hat"*)
            install_docker_centos
            ;;
        *"Fedora"*)
            install_docker_fedora
            ;;
        *)
            print_error "Unsupported OS: $OS"
            print_status "Please install Docker manually for your distribution."
            exit 1
            ;;
    esac
    
    # Install Docker Compose
    install_docker_compose
    
    echo ""
    echo -e "${GREEN}🎉 Docker and Docker Compose installation completed!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
    echo -e "  You need to log out and log back in for the docker group changes to take effect."
    echo -e "  Or run: newgrp docker"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Log out and log back in"
    echo -e "  2. Run: docker --version"
    echo -e "  3. Run: docker-compose --version"
    echo -e "  4. Run: ./scripts/build.sh to build and deploy Vivisews"
}

# Run main function
main "$@"
