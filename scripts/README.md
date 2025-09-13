# Scripts Directory

This directory contains utilities, automation scripts, and development tools for the Game Awards API.

## Categories

### 🧪 **Testing Scripts**
- `test-api.js` - Basic API endpoint testing
- `test-api-endpoints.js` - Comprehensive endpoint testing
- `test-db-connection.js` - Database connectivity testing
- `test-enhanced-api.js` - Enhanced API features testing
- `test-netlify.js` - Netlify Functions testing

### 📊 **Data Management**
- `import-awards.js` - Import award data to database
- `import-awards-data.js` - Enhanced data import with validation
- `demo-api.js` - Demo API with sample data

### 💳 **Stripe Integration**
- `setup-stripe-products.js` - Initialize Stripe products and pricing
- `run-subscription-migration.js` - Handle subscription data migration

### 🔧 **Development Utilities**
- `healthcheck.js` - System health monitoring
- `run-function.js` - Local function testing utility
- `deploy-audit.js` - Pre-deployment validation
- `generate-build-info.js` - Build metadata generation
- `query-awards.js` - Database query testing

### 📋 **Version & Metadata**
- `VERSION` - Current version information

## Usage Examples

### Run API Tests
```bash
node scripts/test-api.js
node scripts/test-api-endpoints.js
```

### Setup Stripe Products
```bash
node scripts/setup-stripe-products.js
```

### Test Database Connection
```bash
node scripts/test-db-connection.js
```

### Import Awards Data
```bash
node scripts/import-awards.js
```

## Development Workflow

1. **Setup**: Run `setup-stripe-products.js` for payment testing
2. **Testing**: Use test scripts to validate functionality
3. **Import**: Load data with import scripts
4. **Deploy**: Run deploy audit before production

## Environment Requirements

Most scripts require environment variables:
- `DATABASE_URL` - Neon/PostgreSQL connection
- `STRIPE_SECRET_KEY` - For payment scripts
- `API_BASE_URL` - For testing scripts

## Notes

- Test scripts use the `demo` API key by default
- Import scripts validate data before insertion
- All scripts include error handling and logging
