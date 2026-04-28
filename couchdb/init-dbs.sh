#!/bin/bash

echo "Starting Farm-Aid Database Initialization..."

# Configuration
DB_USER="admin"
DB_PASS="password123"
BASE_URL="http://$DB_USER:$DB_PASS@localhost:5984"

# Wait for CouchDB to start
until curl -s "$BASE_URL/" > /dev/null; do
  echo "Waiting for CouchDB to be ready..."
  sleep 2
done

echo "CouchDB is up! Creating databases..."

# List of databases to create
DATABASES=("knowledge-base" "market-prices" "consultations" "alerts" "system-config" "sync-logs")

for db in "${DATABASES[@]}"; do
  echo "Creating database: $db"
  curl -s -X PUT "$BASE_URL/$db"
done

echo "Databases created. Installing design documents..."

# 1. Knowledge Base Design Document
curl -s -X PUT "$BASE_URL/knowledge-base/_design/diseases" \
  -H "Content-Type: application/json" \
  -d '{
    "views": {
      "by-species": {
        "map": "function(doc) { if (doc.type === \"disease\" && doc.affected_species) { for (var i = 0; i < doc.affected_species.length; i++) { emit(doc.affected_species[i], { title: doc.title_en, title_tn: doc.title_tn, code: doc.code, severity: doc.severity, notifiable: doc.notifiable || false }); } } }"
      },
      "by-symptom": {
        "map": "function(doc) { if (doc.type === \"disease\" && doc.symptoms) { for (var i = 0; i < doc.symptoms.length; i++) { emit(doc.symptoms[i].toLowerCase(), { title: doc.title_en, code: doc.code, severity: doc.severity }); } } }"
      },
      "by-severity": {
        "map": "function(doc) { if (doc.type === \"disease\" && doc.severity) { emit(doc.severity, { title: doc.title_en, code: doc.code, species: doc.affected_species }); } }"
      }
    }
  }'

# 2. Alerts Design Document
curl -s -X PUT "$BASE_URL/alerts/_design/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "views": {
      "by-region": {
        "map": "function(doc) { if (doc.type === \"alert\" && doc.target_regions) { for (var i = 0; i < doc.target_regions.length; i++) { emit(doc.target_regions[i], { title: doc.title_en, severity: doc.severity, created_at: doc.created_at }); } } }"
      },
      "active-alerts": {
        "map": "function(doc) { if (doc.type === \"alert\" && doc.expires_at) { var now = new Date().toISOString(); if (doc.expires_at > now) { emit(doc.expires_at, { title: doc.title_en, severity: doc.severity, regions: doc.target_regions }); } } }"
      }
    }
  }'

# 3. Consultations Design Document
curl -s -X PUT "$BASE_URL/consultations/_design/consultations" \
  -H "Content-Type: application/json" \
  -d '{
    "views": {
      "by-farmer": {
        "map": "function(doc) { if (doc.type === \"consultation\" && doc.farmer_id) { emit(doc.farmer_id, { status: doc.status, priority: doc.priority, created_at: doc.created_at }); } }"
      },
      "pending-high-priority": {
        "map": "function(doc) { if (doc.type === \"consultation\" && doc.status === \"pending\" && doc.priority === \"high\") { emit(doc.created_at, { farmer_id: doc.farmer_id, subject: doc.subject }); } }"
      }
    }
  }'

echo "Initialization Complete! 🎉"
