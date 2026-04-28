import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('process.env.REACT_APP_API_URL')) {
    content = content.replace(/process\.env\.REACT_APP_API_URL/g, 'import.meta.env.VITE_API_URL');
    changed = true;
  }
  if (content.includes('process.env.REACT_APP_SOCKET_URL')) {
    content = content.replace(/process\.env\.REACT_APP_SOCKET_URL/g, 'import.meta.env.VITE_SOCKET_URL');
    changed = true;
  }

  // Migration patterns removed as we are now fully on Render

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

walk('./src');
