#!/bin/bash

# Development environment management script
# Usage: ./scripts/dev.sh [start|stop|restart|logs|shell|build|db|clean]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

case "${1:-start}" in
    start)
        echo "🚀 Starting Vivisews development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        echo "✅ Development server started at http://localhost:8473"
        echo "🗄️  Database available at localhost:5432"
        echo "📝 Run './scripts/dev.sh logs' to view logs"
        echo "🗄️  Run './scripts/dev.sh db' to access database"
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
    db)
        echo "🗄️  Connecting to PostgreSQL database..."
        docker-compose -f docker-compose.dev.yml exec postgres psql -U vivisews -d vivisews_dev
        ;;
    build)
        echo "🔨 Rebuilding development container..."
        docker-compose -f docker-compose.dev.yml build --no-cache
        docker-compose -f docker-compose.dev.yml up -d
        echo "✅ Development container rebuilt and started"
        ;;
    clean)
        echo "🧹 Cleaning up development environment..."
        echo "⚠️  This will delete ALL data including the database!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f docker-compose.dev.yml down -v
            docker system prune -f
            echo "✅ Development environment cleaned"
        else
            echo "❌ Cleanup cancelled"
        fi
        ;;
    backup)
        echo "💾 Creating database backup..."
        BACKUP_FILE="vivisews_backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose -f docker-compose.dev.yml exec -T postgres pg_dump -U vivisews vivisews_dev > "$BACKUP_FILE"
        echo "✅ Database backup saved to $BACKUP_FILE"
        ;;
    restore)
        if [ -z "$2" ]; then
            echo "❌ Please specify a backup file: ./scripts/dev.sh restore <backup_file>"
            exit 1
        fi
        echo "📥 Restoring database from $2..."
        docker-compose -f docker-compose.dev.yml exec -T postgres psql -U vivisews -d vivisews_dev < "$2"
        echo "✅ Database restored from $2"
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|logs|shell|build|db|backup|restore|clean]"
        echo ""
        echo "Commands:"
        echo "  start   - Start development environment"
        echo "  stop    - Stop development environment"
        echo "  restart - Restart development environment"
        echo "  logs    - Show development logs"
        echo "  shell   - Open shell in development container"
        echo "  build   - Rebuild development container"
        echo "  db      - Connect to PostgreSQL database"
        echo "  backup  - Create database backup"
        echo "  restore - Restore database from backup file"
        echo "  clean   - Clean up development environment (WARNING: deletes all data)"
        exit 1
        ;;
esac
