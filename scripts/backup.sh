#!/bin/bash

# Backup script for Vivisews production environment
# Usage: ./scripts/backup.sh [database|full|restore]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
DATE=$(date +%Y%m%d_%H%M%S)

cd "$PROJECT_DIR"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

case "${1:-full}" in
    database)
        echo "💾 Creating database backup..."
        BACKUP_FILE="$BACKUP_DIR/vivisews_db_$DATE.sql"
        docker-compose exec -T postgres pg_dump -U vivisews vivisews > "$BACKUP_FILE"
        echo "✅ Database backup saved to $BACKUP_FILE"
        ;;
    full)
        echo "💾 Creating full backup..."
        
        # Database backup
        DB_BACKUP_FILE="$BACKUP_DIR/vivisews_db_$DATE.sql"
        echo "📊 Backing up database..."
        docker-compose exec -T postgres pg_dump -U vivisews vivisews > "$DB_BACKUP_FILE"
        
        # Application data backup
        APP_BACKUP_FILE="$BACKUP_DIR/vivisews_app_$DATE.tar.gz"
        echo "📁 Backing up application data..."
        docker-compose exec vivisews tar czf - /usr/share/nginx/html > "$APP_BACKUP_FILE"
        
        # Create backup manifest
        MANIFEST_FILE="$BACKUP_DIR/backup_manifest_$DATE.txt"
        cat > "$MANIFEST_FILE" << EOF
Vivisews Backup Manifest
Created: $(date)
Backup Type: Full

Files:
- Database: $(basename "$DB_BACKUP_FILE")
- Application: $(basename "$APP_BACKUP_FILE")

To restore:
1. Database: docker-compose exec -T postgres psql -U vivisews -d vivisews < $DB_BACKUP_FILE
2. Application: docker-compose exec vivisews tar xzf - < $APP_BACKUP_FILE

EOF
        
        echo "✅ Full backup completed:"
        echo "   📊 Database: $(basename "$DB_BACKUP_FILE")"
        echo "   📁 Application: $(basename "$APP_BACKUP_FILE")"
        echo "   📋 Manifest: $(basename "$MANIFEST_FILE")"
        ;;
    restore)
        if [ -z "$2" ]; then
            echo "❌ Please specify a backup file: ./scripts/backup.sh restore <backup_file>"
            exit 1
        fi
        
        if [ ! -f "$2" ]; then
            echo "❌ Backup file not found: $2"
            exit 1
        fi
        
        echo "⚠️  This will overwrite the current database!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "📥 Restoring database from $2..."
            docker-compose exec -T postgres psql -U vivisews -d vivisews < "$2"
            echo "✅ Database restored from $2"
        else
            echo "❌ Restore cancelled"
        fi
        ;;
    list)
        echo "📋 Available backups:"
        if [ -d "$BACKUP_DIR" ] && [ "$(ls -A "$BACKUP_DIR")" ]; then
            ls -lh "$BACKUP_DIR"/*.sql 2>/dev/null | while read -r line; do
                echo "   📊 $line"
            done
            ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | while read -r line; do
                echo "   📁 $line"
            done
        else
            echo "   No backups found"
        fi
        ;;
    cleanup)
        echo "🧹 Cleaning up old backups..."
        echo "⚠️  This will delete backups older than 30 days!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            find "$BACKUP_DIR" -name "*.sql" -mtime +30 -delete
            find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete
            find "$BACKUP_DIR" -name "backup_manifest_*.txt" -mtime +30 -delete
            echo "✅ Old backups cleaned up"
        else
            echo "❌ Cleanup cancelled"
        fi
        ;;
    *)
        echo "Usage: $0 [database|full|restore|list|cleanup]"
        echo ""
        echo "Commands:"
        echo "  database - Backup only the database"
        echo "  full     - Backup database and application data"
        echo "  restore  - Restore database from backup file"
        echo "  list     - List available backups"
        echo "  cleanup  - Remove backups older than 30 days"
        exit 1
        ;;
esac
