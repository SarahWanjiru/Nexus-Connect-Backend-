# Nexus Connect Backend

Node.js backend API for the Nexus job board platform, integrating with Adzuna API for real-time job listings.

## Features

- **Job Listings** - Fetch jobs from Adzuna API with filtering
- **Authentication** - JWT-based user registration and login
- **Categories** - Get available job categories
- **Top Companies** - Retrieve trending companies

## Tech Stack

- Node.js + Express
- PostgreSQL database
- Adzuna API integration
- JWT authentication
- bcryptjs for password hashing
- Swagger API documentation

## Setup

```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Start development server
npm run dev

# Start production server
npm start
```

## Database Setup

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE nexus_db;
```
3. Update `.env` with your database credentials
4. Run `npm run init-db` to create tables

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get job listings
  - Query params: `country`, `what`, `where`, `page`, `results_per_page`
- `GET /api/jobs/categories` - Get job categories
- `GET /api/jobs/top-companies` - Get top companies

### Health
- `GET /api/health` - Check API status

## Environment Variables

Create `.env` file with:
```
PORT=5000
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
JWT_SECRET=your_jwt_secret

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexus_db
DB_USER=postgres
DB_PASSWORD=your_password
```

## API Documentation

Swagger UI available at: `http://localhost:5000/api-docs`

## Example Requests

```bash
# Get jobs
curl http://localhost:5000/api/jobs?what=developer&where=remote

# Register
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","fullName":"John Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```
