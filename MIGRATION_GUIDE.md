# 🔄 Migration Guide: localStorage to PostgreSQL

This guide helps you migrate from the current localStorage-based data storage to the new PostgreSQL database system that ensures data persistence across container updates.

## 🎯 What's Changing

**Before (Current):**
- All data stored in browser localStorage
- Data lost when containers are updated/restarted
- No data sharing between different browsers/devices
- No backup capabilities

**After (New):**
- All data stored in PostgreSQL database
- Data persists across container updates and restarts
- Data accessible from any browser/device
- Full backup and restore capabilities

## 🚀 Quick Migration Steps

### 1. Backup Current Data (Optional)

If you have existing data in localStorage that you want to preserve:

1. **Export localStorage Data:**
   ```javascript
   // Run this in browser console on your current Vivisews app
   const authData = localStorage.getItem('auth-store');
   const fabricData = localStorage.getItem('fabric-store');
   
   // Download the data
   const data = {
     auth: JSON.parse(authData || '{}'),
     fabric: JSON.parse(fabricData || '{}')
   };
   
   const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'vivisews_backup_' + new Date().toISOString().split('T')[0] + '.json';
   a.click();
   ```

### 2. Deploy New Database System

1. **Stop Current Containers:**
   ```bash
   docker-compose down
   ```

2. **Start with New Database:**
   ```bash
   # For development
   ./scripts/dev.sh start
   
   # For production
   docker-compose up -d
   ```

3. **Verify Database is Running:**
   ```bash
   # Check if PostgreSQL is healthy
   docker-compose ps postgres
   
   # View database logs
   docker-compose logs postgres
   ```

### 3. Import Previous Data (If Applicable)

If you exported data in step 1, you can import it:

1. **Create Import Script:**
   ```bash
   # Create a temporary import script
   cat > import_data.js << 'EOF'
   const fs = require('fs');
   const { Pool } = require('pg');
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL || 'postgresql://vivisews:vivisews_dev_password@localhost:5432/vivisews_dev'
   });
   
   async function importData() {
     try {
       const data = JSON.parse(fs.readFileSync('vivisews_backup_YYYY-MM-DD.json', 'utf8'));
       
       // Import users
       if (data.auth.users) {
         for (const user of data.auth.users) {
           await pool.query(`
             INSERT INTO users (id, email, username, password_hash, role, status, language, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING
           `, [user.id, user.email, user.username, user.password, user.role, user.status, user.language, user.createdAt]);
         }
       }
       
       // Import fabrics
       if (data.fabric.fabrics) {
         for (const fabric of data.fabric.fabrics) {
           await pool.query(`
             INSERT INTO fabrics (id, user_id, name, type, fiber_content, weight, color, pattern, width, total_yards, cost_per_yard, total_cost, source, notes, is_pinned, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
             ON CONFLICT (id) DO NOTHING
           `, [fabric.id, fabric.userId, fabric.name, fabric.type, fabric.fiberContent, fabric.weight, fabric.color, fabric.pattern, fabric.width, fabric.totalYards, fabric.costPerYard, fabric.totalCost, fabric.source, fabric.notes, fabric.isPinned, fabric.createdAt]);
         }
       }
       
       console.log('Data import completed successfully!');
     } catch (error) {
       console.error('Import failed:', error);
     } finally {
       await pool.end();
     }
   }
   
   importData();
   EOF
   ```

2. **Run Import:**
   ```bash
   # Install pg if needed
   npm install pg
   
   # Run import
   node import_data.js
   ```

## 🔧 Database Management

### Development Environment

```bash
# Access database
./scripts/dev.sh db

# Create backup
./scripts/dev.sh backup

# Restore from backup
./scripts/dev.sh restore <backup_file>

# Clean environment (WARNING: deletes all data)
./scripts/dev.sh clean
```

### Production Environment

```bash
# Create backup
./scripts/backup.sh full

# List backups
./scripts/backup.sh list

# Restore from backup
./scripts/backup.sh restore <backup_file>

# Clean old backups
./scripts/backup.sh cleanup
```

## 🗄️ Database Schema

The new database includes these tables:

- **users** - User accounts and authentication
- **fabrics** - Fabric inventory
- **projects** - Sewing projects
- **project_materials** - Materials used in projects
- **project_patterns** - Patterns used in projects
- **patterns** - Pattern collection
- **usage_history** - Fabric usage tracking
- **app_settings** - Application configuration

## 🔒 Security Considerations

### Database Passwords

**Development:**
- Username: `vivisews`
- Password: `vivisews_dev_password`
- Database: `vivisews_dev`

**Production:**
- Username: `vivisews`
- Password: `vivisews_prod_password`
- Database: `vivisews`

⚠️ **Important:** Change these default passwords in production!

### Environment Variables

Update your `.env` file:

```env
# Development
DATABASE_URL=postgresql://vivisews:vivisews_dev_password@postgres:5432/vivisews_dev

# Production
DATABASE_URL=postgresql://vivisews:vivisews_prod_password@postgres:5432/vivisews
```

## 🚨 Rollback Plan

If you need to rollback to the old system:

1. **Stop new containers:**
   ```bash
   docker-compose down
   ```

2. **Remove database volumes:**
   ```bash
   docker volume rm vivisews_postgres_data
   ```

3. **Revert Docker Compose files:**
   ```bash
   git checkout HEAD~1 docker-compose.yml docker-compose.dev.yml
   ```

4. **Restart old system:**
   ```bash
   docker-compose up -d
   ```

## 📊 Performance Monitoring

Monitor database performance:

```bash
# Check database connections
docker-compose exec postgres psql -U vivisews -d vivisews -c "SELECT count(*) FROM pg_stat_activity;"

# Check table sizes
docker-compose exec postgres psql -U vivisews -d vivisews -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"

# Monitor slow queries
docker-compose exec postgres psql -U vivisews -d vivisews -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

## ✅ Verification Checklist

After migration, verify:

- [ ] Database is running and healthy
- [ ] Application connects to database successfully
- [ ] User login/signup works
- [ ] Fabric data can be added/edited/deleted
- [ ] Project data can be managed
- [ ] Pattern data can be managed
- [ ] Backup/restore functionality works
- [ ] Data persists after container restart

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # Check database logs
   docker-compose logs postgres
   
   # Restart database
   docker-compose restart postgres
   ```

2. **Data Not Persisting:**
   ```bash
   # Check volume mounts
   docker volume ls | grep postgres
   
   # Verify data directory
   docker-compose exec postgres ls -la /var/lib/postgresql/data
   ```

3. **Permission Issues:**
   ```bash
   # Fix volume permissions
   sudo chown -R 999:999 /var/lib/docker/volumes/vivisews_postgres_data
   ```

### Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify database health: `docker-compose exec postgres pg_isready -U vivisews`
3. Test database connection: `docker-compose exec postgres psql -U vivisews -d vivisews -c "SELECT version();"`

## 🎉 Migration Complete!

Once you've completed the migration:

1. **Test thoroughly** with your existing data
2. **Create a backup** of the new system
3. **Update your deployment scripts** if needed
4. **Document any custom configurations**

Your data will now persist across all container updates and restarts! 🎊
