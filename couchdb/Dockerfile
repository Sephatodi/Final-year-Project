FROM couchdb:latest

# Set up environment variables
ENV COUCHDB_USER=admin
ENV COUCHDB_PASSWORD=password1234
ENV COUCHDB_SECRET=farmaid_secret_key_2026

# Create data directory with proper permissions
RUN mkdir -p /opt/couchdb/data && \
    chown -R couchdb:couchdb /opt/couchdb/data

# Copy custom configuration
COPY local.ini /opt/couchdb/etc/local.ini

# Expose the CouchDB port
EXPOSE 5984
