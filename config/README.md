# Demo Credentials Configuration

This directory contains configuration files for demo credentials used in the vivi.sews application.

## Files

- `demo-credentials.json` - Contains all demo account credentials and metadata

## Demo Accounts

### Admin Account
- **Username**: ADMIN
- **Password**: pineda0322
- **Email**: admin@vivisews.com
- **Role**: admin
- **Access**: Full system access, user management, admin dashboard

### Regular User Account
- **Username**: john_doe
- **Password**: password123
- **Email**: john@example.com
- **Role**: user
- **Access**: Standard user features, fabric and project management

### Pending User Account
- **Username**: jane_smith
- **Password**: password123
- **Email**: jane@example.com
- **Role**: user (pending approval)
- **Access**: Account pending admin approval

## Usage

These credentials are for development and testing purposes only. In a production environment:

1. **Change the admin password** immediately after deployment
2. **Use strong passwords** for all accounts
3. **Remove or secure** this configuration file
4. **Implement proper password hashing** in the authentication system

## Security Notes

- These are demo passwords and should never be used in production
- The admin password should be changed immediately upon deployment
- Consider implementing environment variables for sensitive credentials
- Use proper password hashing (bcrypt, Argon2, etc.) in production

## Updating Credentials

To update demo credentials:

1. Edit `demo-credentials.json`
2. Update the `lastUpdated` field
3. Increment the `version` if making breaking changes
4. Update this README if account details change

## Production Deployment

Before deploying to production:

1. Remove or secure this config directory
2. Implement proper credential management
3. Use environment variables for sensitive data
4. Set up proper user registration and password reset flows
5. Implement email verification for new accounts
