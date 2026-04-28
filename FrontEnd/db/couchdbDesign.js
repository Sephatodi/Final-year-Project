// db/couchdbDesign.js
// CouchDB Design Documents for Mango Queries and Views
// Import this into CouchDB via the _bulk_docs endpoint

export const couchdbDesignDocs = {
  "_id": "_design/knowledge-base",
  "language": "query",
  "views": {
    "all": {
      "map": {
        "fields": {
          "diseaseCode": "asc",
          "species": "asc",
          "createdAt": "desc"
        }
      }
    },
    "by-disease-code": {
      "map": {
        "fields": {
          "diseaseCode": "asc"
        }
      }
    },
    "by-species": {
      "map": {
        "fields": {
          "species": "asc",
          "titleEn": "asc"
        }
      }
    },
    "by-notifiable": {
      "map": {
        "fields": {
          "notifiable": "asc",
          "diseaseCode": "asc"
        }
      }
    },
    "by-update-time": {
      "map": {
        "fields": {
          "updatedAt": "desc"
        }
      }
    }
  },
  "indexes": {
    "diseaseCode-index": {
      "fields": [{"diseaseCode": "asc"}]
    },
    "species-index": {
      "fields": [{"species": "asc"}]
    },
    "notifiable-index": {
      "fields": [{"notifiable": "asc"}]
    },
    "search-index": {
      "fields": [{"titleEn": "asc"}, {"titleTn": "asc"}, {"tags": "asc"}]
    }
  }
};

export const couchdbInitialization = {
  // CouchDB database name
  databaseName: process.env.REACT_APP_COUCHDB_NAME || 'farmaid',
  
  // CouchDB URL for replication
  remoteUrl: process.env.REACT_APP_COUCHDB_URL || 'http://localhost:5984/farmaid',
  
  // Default design document
  designDoc: couchdbDesignDocs,
  
  // Replication options
  replicationOptions: {
    live: true,
    retry: true,
    continuous: true,
    heartbeat: 30000,
    timeout: 60000,
    checkpoint: 'source'
  },
  
  // Conflict resolution strategy
  conflictResolution: 'use_local',  // 'use_local', 'use_remote', or 'merge'
  
  // Authentication (if needed)
  auth: {
    username: process.env.REACT_APP_COUCHDB_USER || 'admin',
    password: process.env.REACT_APP_COUCHDB_PASSWORD || 'password123'
  }
};

// Helper function to setup CouchDB replication
export async function setupCouchDBReplication(pouchDB, remoteUrl) {
  try {
    // Create design document
    await pouchDB.put(couchdbDesignDocs);
    
    // Setup replication
    const result = await pouchDB.replicate.to(remoteUrl, couchdbInitialization.replicationOptions);
    
    console.log('CouchDB replication setup complete:', result);
    return result;
  } catch (error) {
    console.error('Error setting up CouchDB replication:', error);
    throw error;
  }
}

// Helper function to import bulk documents into CouchDB
export async function importBulkDocuments(couchdbUrl, documents) {
  try {
    const response = await fetch(`${couchdbUrl}/_bulk_docs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        docs: documents
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Bulk import successful:', result);
    return result;
  } catch (error) {
    console.error('Error importing bulk documents:', error);
    throw error;
  }
}
