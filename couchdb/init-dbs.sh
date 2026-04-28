#!/bin/bash

echo "Creating Farm-Aid databases..."

# Wait for CouchDB to start
until curl -s http://admin:password1234@localhost:5984/ > /dev/null; do
  echo "Waiting for CouchDB to be ready..."
  sleep 2
done

# Create databases
curl -X PUT http://admin:password1234@localhost:5984/knowledge-base
curl -X PUT http://admin:password1234@localhost:5984/market-prices
curl -X PUT http://admin:password1234@localhost:5984/consultations
curl -X PUT http://admin:password1234@localhost:5984/alerts
curl -X PUT http://admin:password1234@localhost:5984/system-config
curl -X PUT http://admin:password1234@localhost:5984/sync-logs

echo "Databases created successfully!"
