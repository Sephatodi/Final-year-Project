#!/bin/bash

# Farm-Aid Database Reset Script
# This script resets the database to a clean state

set -e

echo "========================================="
echo "🔄 Farm-Aid Database Reset"
echo "========================================="

# Load environment variables
if [ -f ../.env ]; then
    source ../.env
else
    DB_USER=${DB_USER:-postgres}
    DB_PASSWORD=${DB_PASSWORD:-postgres}
    DB_NAME=${DB_NAME:-farm_aid}
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-5432}
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Confirm reset
print_warning "This will DELETE ALL DATA in the '$DB_NAME' database!"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Reset cancelled"
    exit 0
fi

# Check PostgreSQL connection
print_status "Checking PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
    print_error "PostgreSQL is not running"
    exit 1
fi

# Drop database if exists
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    print_status "Dropping database '$DB_NAME'..."
    dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER --if-exists "$DB_NAME"
    print_success "Database dropped"
fi

# Create fresh database
print_status "Creating fresh database '$DB_NAME'..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER "$DB_NAME"
print_success "Database created"

# Run schema
print_status "Creating tables..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -f ../src/db/schema.sql
print_success "Tables created"

# Run seed data
print_status "Seeding database..."
node seed-data.js
print_success "Database seeded"

# Create indexes
print_status "Creating indexes..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d "$DB_NAME" -f - <<EOF > /dev/null 2>&1
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_livestock_farmer ON livestock(farmer_id);
CREATE INDEX IF NOT EXISTS idx_livestock_tag ON livestock(baits_tag_number);
CREATE INDEX IF NOT EXISTS idx_consultations_farmer ON consultations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_expert ON consultations(expert_id);
CREATE INDEX IF NOT EXISTS idx_messages_consultation ON messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_user ON sync_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
EOF
print_success "Indexes created"

echo "========================================="
print_success "Database Reset Complete!"
echo "========================================="
echo "📊 Database: $DB_NAME is ready with fresh data"
echo "📝 Test accounts are available"
echo "========================================="

# Option to run tests
read -p "Run tests after reset? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd ..
    npm run test:all
fi