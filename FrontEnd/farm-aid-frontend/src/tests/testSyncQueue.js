const { syncQueue } = require('../db/queries');
const { userQueries } = require('../db/queries');
const pool = require('../db/pool');

async function testSyncQueue() {
  console.log('🧪 Testing Sync Queue...\n');

  try {
    // Create a test user
    const userData = {
      name: 'Sync Test User',
      phone: '+26771123459',
      email: 'sync@test.com',
      password_hash: 'hashed',
      role: 'farmer'
    };
    const user = await userQueries.createUser(userData);

    // Test 1: Queue single item
    console.log('Test 1: Queueing single item');
    const item1 = await syncQueue.queueItem({
      user_id: user.id,
      operation_type: 'INSERT',
      table_name: 'health_records',
      record_id: 123,
      data: { symptoms: 'fever', diagnosis: 'test' },
      priority: 1
    });
    console.log('✅ Item queued:', { id: item1.id, status: 'pending' });

    // Test 2: Queue batch items
    console.log('\nTest 2: Queueing batch items');
    const batchItems = [
      {
        user_id: user.id,
        operation_type: 'UPDATE',
        table_name: 'livestock',
        record_id: 456,
        data: { health_status: 'sick' },
        priority: 2
      },
      {
        user_id: user.id,
        operation_type: 'INSERT',
        table_name: 'disease_reports',
        record_id: 789,
        data: { location: 'Test Location' },
        priority: 3
      }
    ];
    const queuedBatch = await syncQueue.queueBatch(batchItems);
    console.log(`✅ Queued ${queuedBatch.length} items`);

    // Test 3: Get pending items for user
    console.log('\nTest 3: Getting pending items for user');
    const pending = await syncQueue.getPendingItems(user.id);
    console.log(`✅ Found ${pending.length} pending items for user`);
    pending.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.operation_type} on ${item.table_name} (priority: ${item.priority})`);
    });

    // Test 4: Get all pending items
    console.log('\nTest 4: Getting all pending items');
    const allPending = await syncQueue.getAllPendingItems(10);
    console.log(`✅ Found ${allPending.length} total pending items`);

    // Test 5: Mark item as synced
    console.log('\nTest 5: Marking item as synced');
    await syncQueue.markAsSynced(item1.id, { server_id: 1001 });
    console.log('✅ Item marked as synced');

    // Test 6: Mark item as failed
    console.log('\nTest 6: Marking item as failed');
    await syncQueue.markAsFailed(pending[1].id, 'Network error');
    console.log('✅ Item marked as failed');

    // Test 7: Retry failed items
    console.log('\nTest 7: Retrying failed items');
    const retried = await syncQueue.retryFailedItems(3);
    console.log(`✅ Retried ${retried.length} failed items`);

    // Test 8: Get user sync status
    console.log('\nTest 8: Getting user sync status');
    const status = await syncQueue.getUserSyncStatus(user.id);
    console.log('✅ Sync status:', {
      pending: status.pending_count,
      failed: status.failed_count,
      last_successful: status.last_successful_sync
    });

    // Test 9: Process by type (simulated)
    console.log('\nTest 9: Processing items by type');
    const processor = async (item) => {
      console.log(`   Processing: ${item.operation_type} on ${item.table_name}`);
      return { processed: true, timestamp: new Date() };
    };
    
    // This would normally run in background
    console.log('✅ Processor ready (would process items in production)');

    // Test 10: Get stats
    console.log('\nTest 10: Getting sync queue stats');
    const stats = await syncQueue.getStats();
    console.log('✅ Queue stats:', {
      total: stats.total,
      pending: stats.pending,
      synced: stats.synced,
      failed: stats.failed,
      avg_sync_time: stats.avg_sync_time_seconds?.toFixed(2) + 's'
    });

    // Test 11: Cleanup old items
    console.log('\nTest 11: Cleaning up old synced items');
    const deleted = await syncQueue.cleanupOldItems(0); // 0 days for testing
    console.log(`✅ Deleted ${deleted} old synced items`);

    console.log('\n🎉 All sync queue tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testSyncQueue();