const fs = require('fs');
const path = require('path');

console.log('📁 Initializing upload directories...');

const dirs = [
  'public/uploads',
  'public/uploads/avatars'
];

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
});

console.log('✅ Upload directories ready!');