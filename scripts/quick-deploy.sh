#!/bin/bash

# Quick Deploy Script for Vivisews
# For development and testing purposes

set -e

# Colors for output
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

echo -e "${BLUE}🚀 Quick Deploy Script for Vivisews${NC}"
echo "====================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_warning "Docker is not running. Starting Docker..."
    if command -v open > /dev/null 2>&1; then
        open -a Docker
        sleep 10
    else
        print_warning "Please start Docker manually and run this script again."
        exit 1
    fi
fi

# Build and start the application
print_status "Building and starting Vivisews..."

# Stop any existing containers
docker-compose down 2>/dev/null || true

# Build and start
docker-compose up -d --build

# Wait for the application to start
print_status "Waiting for application to start..."
sleep 5

# Check if the application is running
if curl -f http://localhost:8473/health > /dev/null 2>&1; then
    echo ""
    echo -e "${GREEN}🎉 Vivisews is now running!${NC}"
    echo ""
    echo -e "${BLUE}Access your application at:${NC}"
    echo -e "  http://localhost:8473"
    echo ""
    echo -e "${YELLOW}Default admin credentials:${NC}"
    echo -e "  Username: ADMIN"
    echo -e "  Password: ADMIN"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "  View logs: docker-compose logs -f"
    echo -e "  Stop: docker-compose down"
    echo -e "  Restart: docker-compose restart"
else
    print_warning "Application may still be starting up. Please wait a moment and try accessing http://localhost:8473"
fi
