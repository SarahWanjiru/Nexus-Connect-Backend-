# PostgreSQL Database Setup

## Create Database

Run these commands in your terminal:

```bash
# Connect to PostgreSQL as postgres user
sudo -u postgres psql

# Or on some systems:
psql -U postgres
```

Then in the PostgreSQL prompt:

```sql
-- Create the database
CREATE DATABASE nexus_connect;

-- Exit PostgreSQL
\q
```

## Initialize Tables

After creating the database, run:

```bash
npm run init-db
```

This will create the users table automatically.

## Verify Connection

```bash
# Connect to the database
psql -U postgres -d nexus_connect

# List tables
\dt

# Exit
\q
```
