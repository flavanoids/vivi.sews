.PHONY: help install build start stop restart logs clean deploy docker-install quick-deploy

# Default target
help:
	@echo "🧵 Vivisews - Available Commands"
	@echo "=================================="
	@echo ""
	@echo "Development:"
	@echo "  install        Install dependencies"
	@echo "  build          Build the application"
	@echo "  dev            Start development server"
	@echo ""
	@echo "Docker Operations:"
	@echo "  docker-install Install Docker and Docker Compose"
	@echo "  start          Start the application with Docker"
	@echo "  stop           Stop the application"
	@echo "  restart        Restart the application"
	@echo "  logs           View application logs"
	@echo "  clean          Remove Docker containers and images"
	@echo ""
	@echo "Deployment:"
	@echo "  deploy         Deploy to production (bare metal)"
	@echo "  quick-deploy   Quick deployment for testing"
	@echo ""
	@echo "Utilities:"
	@echo "  lint           Run ESLint"
	@echo "  test           Run tests (if available)"
	@echo "  help           Show this help message"

# Development commands
install:
	@echo "📦 Installing dependencies..."
	npm ci

build:
	@echo "🔨 Building application..."
	npm run build

dev:
	@echo "🚀 Starting development server..."
	npm run dev

# Docker commands
docker-install:
	@echo "🐳 Installing Docker and Docker Compose..."
	@chmod +x scripts/install-docker.sh
	@./scripts/install-docker.sh

start:
	@echo "🚀 Starting Vivisews with Docker..."
	docker-compose up -d

stop:
	@echo "🛑 Stopping Vivisews..."
	docker-compose down

restart:
	@echo "🔄 Restarting Vivisews..."
	docker-compose restart

logs:
	@echo "📋 Viewing logs..."
	docker-compose logs -f

clean:
	@echo "🧹 Cleaning Docker resources..."
	docker-compose down -v --rmi all
	docker system prune -f

# Deployment commands
deploy:
	@echo "🚀 Deploying to production..."
	@chmod +x scripts/build.sh
	@./scripts/build.sh

quick-deploy:
	@echo "⚡ Quick deployment for testing..."
	@chmod +x scripts/quick-deploy.sh
	@./scripts/quick-deploy.sh

# Utility commands
lint:
	@echo "🔍 Running ESLint..."
	npm run lint

test:
	@echo "🧪 Running tests..."
	@echo "No tests configured yet"

# Health check
health:
	@echo "🏥 Checking application health..."
	@curl -f http://localhost:8473/health || echo "Application is not running"

# Status check
status:
	@echo "📊 Application status:"
	@docker-compose ps
	@echo ""
	@echo "🔗 Access URLs:"
	@echo "  Local: http://localhost:8473"
	@echo "  Health: http://localhost:8473/health"
