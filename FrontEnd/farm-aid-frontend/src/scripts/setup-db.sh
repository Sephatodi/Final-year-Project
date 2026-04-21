#!/bin/bash

# Farm-Aid Database Setup Script
# This script creates and initializes the database

set -e  # Exit on any error

echo "========================================="
echo "🚀 Farm-Aid Database Setup"
echo "========================================="

# Load environment variables
if [ -f ../.env ]; then
    source ../.env
else
    echo "⚠️  .env file not found, using defaults"
    DB_USER=${DB_USER:-postgres}
    DB_PASSWORD=${DB_PASSWORD:-postgres}
    DB_NAME=${DB_NAME:-farm_aid}
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-5432}
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check PostgreSQL connection
print_status "Checking PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
    print_error "PostgreSQL is not running or not accessible at $DB_HOST:$DB_PORT"
    echo "Please start PostgreSQL:"
    echo "  - On macOS: brew services start postgresql"
    echo "  - On Linux: sudo systemctl start postgresql"
    echo "  - On Docker: docker-compose up -d postgres"
    exit 1
fi
print_success "PostgreSQL is running"

# Drop database if it exists (with confirmation)
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    print_warning "Database '$DB_NAME' already exists"
    read -p "Do you want to drop and recreate it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Dropping database '$DB_NAME'..."
        dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER --if-exists "$DB_NAME"
        print_success "Database dropped"
    else
        print_status "Keeping existing database"
        exit 0
    fi
fi

# Create database
print_status "Creating database '$DB_NAME'..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER "$DB_NAME"
print_success "Database created"

# Run schema
print_status "Creating tables from schema.sql..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -f ../src/db/schema.sql
if [ $? -eq 0 ]; then
    print_success "Tables created successfully"
else
    print_error "Failed to create tables"
    exit 1
fi

# Run seed data
print_status "Seeding database with initial data..."
node seed-data.js
if [ $? -eq 0 ]; then
    print_success "Database seeded successfully"
else
    print_error "Failed to seed database"
    exit 1
fi

# Create extensions if needed
print_status "Creating extensions..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" > /dev/null 2>&1
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"pg_trgm\";" > /dev/null 2>&1
print_success "Extensions created"

# Create indexes
print_status "Creating indexes..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" <<EOF > /dev/null 2>&1
-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Livestock indexes
CREATE INDEX IF NOT EXISTS idx_livestock_farmer ON livestock(farmer_id);
CREATE INDEX IF NOT EXISTS idx_livestock_tag ON livestock(baits_tag_number);
CREATE INDEX IF NOT EXISTS idx_livestock_species ON livestock(species);

-- Health records indexes
CREATE INDEX IF NOT EXISTS idx_health_records_livestock ON health_records(livestock_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(date);

-- Consultations indexes
CREATE INDEX IF NOT EXISTS idx_consultations_farmer ON consultations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_expert ON consultations(expert_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_consultation ON messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);

-- Knowledge base indexes
CREATE INDEX IF NOT EXISTS idx_kb_disease_code ON knowledge_base_articles(disease_code);
CREATE INDEX IF NOT EXISTS idx_kb_species ON knowledge_base_articles(species);
CREATE INDEX IF NOT EXISTS idx_kb_notifiable ON knowledge_base_articles(notifiable);

-- Sync queue indexes
CREATE INDEX IF NOT EXISTS idx_sync_queue_user ON sync_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_priority ON sync_queue(priority);

-- Alerts indexes
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_expiry ON alerts(expiry);
EOF
print_success "Indexes created"

# Analyze database
print_status "Analyzing database..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -c "ANALYZE;" > /dev/null 2>&1
print_success "Database analyzed"

# Get database size
DB_SIZE=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" | xargs)
print_success "Database size: $DB_SIZE"

echo "========================================="
print_success "Farm-Aid Database Setup Complete!"
echo "========================================="
echo "📊 Database: $DB_NAME"
echo "🔗 Connection: postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo "📝 Test accounts:"
echo "   - Farmer:  thato@example.com / farmer123"
echo "   - Expert:  kgomotso@vet.co.bw / expert123"
echo "   - Admin:   admin@farm-aid.com / admin123"
echo "========================================="

# Optional: Connect to database
read -p "Connect to database now? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME"
fi