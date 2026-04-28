FROM couchdb:latest

# Set up environment variables
ENV COUCHDB_USER=admin
ENV COUCHDB_PASSWORD=password123
ENV COUCHDB_SECRET=farmaid_secret_key_2026

# Create data directory with proper permissions
RUN mkdir -p /opt/couchdb/data && \
    chown -R couchdb:couchdb /opt/couchdb/data

# Copy custom configuration
COPY local.ini /opt/couchdb/etc/local.ini

# Copy initialization script
COPY init-dbs.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init-dbs.sh

# Expose the CouchDB port
EXPOSE 5984
