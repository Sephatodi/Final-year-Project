// Offline components index file
import ConflictResolver from './ConflictResolver';
import DataExporter from './DataExporter';
import OfflineQueue from './OfflineQueue';
import PendingChanges from './PendingChanges';
import SyncManager from './SyncManager';

// Re-export all offline components as a single object
const OfflineComponents = {
  SyncManager,
  OfflineQueue,
  PendingChanges,
  ConflictResolver,
  DataExporter,
};

export default OfflineComponents;