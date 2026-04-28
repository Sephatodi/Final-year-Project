const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

const cleanupOldFiles = async (daysOld = 7) => {
  try {
    const uploadDir = path.join(__dirname, '../../uploads');
    const files = await fs.readdir(uploadDir);
    
    const now = Date.now();
    const maxAge = daysOld * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      
      // Check if file is older than daysOld
      if (now - stats.mtimeMs > maxAge) {
        await fs.unlink(filePath);
        deletedCount++;
        logger.info(`Deleted old file: ${file}`);
      }
    }
    
    logger.info(`File cleanup completed. Deleted ${deletedCount} files.`);
    return { success: true, deletedCount };
  } catch (error) {
    logger.error('File cleanup error:', error);
    throw error;
  }
};

const getFileSize = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    logger.error('Error getting file size:', error);
    return 0;
  }
};

const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
};

module.exports = {
  cleanupOldFiles,
  getFileSize,
  ensureDirectoryExists
};