# Development Guide

## Overview

ViviSews now uses a backend API with PostgreSQL database for persistent data storage. This ensures that user fabrics are saved and accessible from any device, similar to applications like Tandoor Recipes.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React)       │◄──►│   (Express.js)  │◄──►│   Database      │
│   Port: 5173    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Changes

### 1. Data Persistence
- **Before**: Data stored in browser localStorage (lost on browser clear)
- **After**: Data stored in PostgreSQL database (persistent across devices)

### 2. Authentication
- **Before**: Simple client-side authentication
- **After**: JWT-based authentication with bcrypt password hashing

### 3. API Structure
- **Before**: Client-side state management only
- **After**: RESTful API with proper error handling and validation

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (or Docker)
- npm or yarn

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Database Setup**
   ```bash
   # Using Docker
   docker run --name vivisews-postgres -e POSTGRES_DB=vivisews -e POSTGRES_USER=vivisews -e POSTGRES_PASSWORD=vivisews_dev_password -p 5432:5432 -d postgres:15-alpine
   
   # Or install PostgreSQL locally
   # Then run the init-db.sql script
   ```

3. **Environment Variables**
   Create `.env` file in backend directory:
   ```env
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=vivisews
   DB_USER=vivisews
   DB_PASSWORD=vivisews_dev_password
   JWT_SECRET=dev-secret-key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

### Frontend Setup

1. **Environment Variables**
   Create `.env` file in root directory:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
```
POST /api/auth/login     - User login
POST /api/auth/signup    - User registration
GET  /api/auth/profile   - Get user profile
PUT  /api/auth/profile   - Update user profile
```

### Fabrics
```
GET    /api/fabrics              - Get user's fabrics
POST   /api/fabrics              - Create new fabric
PUT    /api/fabrics/:id          - Update fabric
DELETE /api/fabrics/:id          - Delete fabric
PATCH  /api/fabrics/:id/pin      - Toggle fabric pin
POST   /api/fabrics/:id/usage    - Record fabric usage
GET    /api/fabrics/usage/history - Get usage history
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_email_verified BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP
);
```

### Fabrics Table
```sql
CREATE TABLE fabrics (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    fiber_content VARCHAR(255),
    weight VARCHAR(255),
    color VARCHAR(255),
    pattern VARCHAR(255),
    width DECIMAL(5,2),
    total_yards DECIMAL(8,2) NOT NULL,
    cost_per_yard DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    source VARCHAR(255),
    notes TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Backend Testing
```bash
# Test the API endpoints
node test-backend.js

# Or use curl
curl http://localhost:3001/health
```

### Frontend Testing
1. Open http://localhost:5173
2. Create a new account
3. Add some fabrics
4. Test cross-device access

## Docker Development

### Start Development Environment
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Access Services
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Database: localhost:5432

## Production Deployment

### Using Docker
```bash
docker-compose up --build -d
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Start backend: `cd backend && npm start`
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

## Security Features

- JWT token authentication
- bcrypt password hashing
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- SQL injection prevention

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View database logs
docker logs vivisews-postgres
```

### API Connection Issues
```bash
# Test API health
curl http://localhost:3001/health

# Check backend logs
cd backend && npm run dev
```

### Frontend Issues
```bash
# Check environment variables
echo $VITE_API_URL

# Clear browser cache
# Check browser console for errors
```

## Migration from Old Version

If you have data in the old localStorage version:

1. Export data from old version
2. Import data through the new API
3. Verify data integrity
4. Test functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository
