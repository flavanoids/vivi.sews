#!/bin/bash

# Development environment management script
# Usage: ./scripts/dev.sh [start|stop|restart|logs|shell|build]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

case "${1:-start}" in
    start)
        echo "🚀 Starting Vivisews development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        echo "✅ Development server started at http://localhost:8473"
        echo "📝 Run './scripts/dev.sh logs' to view logs"
        ;;
    stop)
        echo "🛑 Stopping Vivisews development environment..."
        docker-compose -f docker-compose.dev.yml down
        echo "✅ Development environment stopped"
        ;;
    restart)
        echo "🔄 Restarting Vivisews development environment..."
        docker-compose -f docker-compose.dev.yml down
        docker-compose -f docker-compose.dev.yml up -d
        echo "✅ Development environment restarted"
        ;;
    logs)
        echo "📋 Showing development logs..."
        docker-compose -f docker-compose.dev.yml logs -f
        ;;
    shell)
        echo "🐚 Opening shell in development container..."
        docker-compose -f docker-compose.dev.yml exec vivisews-dev sh
        ;;
    build)
        echo "🔨 Rebuilding development container..."
        docker-compose -f docker-compose.dev.yml build --no-cache
        docker-compose -f docker-compose.dev.yml up -d
        echo "✅ Development container rebuilt and started"
        ;;
    clean)
        echo "🧹 Cleaning up development environment..."
        docker-compose -f docker-compose.dev.yml down -v
        docker system prune -f
        echo "✅ Development environment cleaned"
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|logs|shell|build|clean]"
        echo ""
        echo "Commands:"
        echo "  start   - Start development environment"
        echo "  stop    - Stop development environment"
        echo "  restart - Restart development environment"
        echo "  logs    - Show development logs"
        echo "  shell   - Open shell in development container"
        echo "  build   - Rebuild development container"
        echo "  clean   - Clean up development environment"
        exit 1
        ;;
esac
