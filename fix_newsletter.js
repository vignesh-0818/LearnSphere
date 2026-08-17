const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const searchStr = `onsubmit="event.preventDefault(); document.querySelector('.toast').classList.add('is-visible'); setTimeout(() => document.querySelector('.toast').classList.remove('is-visible'), 3000);"`;
      const replaceStr = `onsubmit="event.preventDefault(); document.querySelector('.toast').classList.add('is-visible'); setTimeout(() => document.querySelector('.toast').classList.remove('is-visible'), 3000); this.reset();"`;
      
      if (content.includes(searchStr)) {
        content = content.replace(new RegExp(searchStr.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&'), 'g'), replaceStr);
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

replaceInDir(__dirname);
