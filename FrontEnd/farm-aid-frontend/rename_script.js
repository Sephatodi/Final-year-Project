const fs = require('fs');
const path = require('path');

function renameFilesInDir(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (file.endsWith('.jsx') && file !== 'mockApi.jsx') {
            const newPath = fullPath.replace(/\.jsx$/, '.js');
            fs.renameSync(fullPath, newPath);
            console.log(`Renamed: ${fullPath} -> ${newPath}`);
        }
    });
}

renameFilesInDir('src/db');
renameFilesInDir('src/services');
renameFilesInDir('src/hooks');
console.log('Rename complete.');
