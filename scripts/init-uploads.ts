import * as fsInit from 'fs';
import * as pathInit from 'path';

console.log('📁 Initializing upload directories...');

const uploadDirsInit = [
  'public/uploads',
  'public/uploads/avatars'
];

uploadDirsInit.forEach(dir => {
  const fullPath = pathInit.join(process.cwd(), dir);
  if (!fsInit.existsSync(fullPath)) {
    fsInit.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`📁 Directory exists: ${dir}`);
  }
});

// Create .gitkeep files to ensure directories are tracked
uploadDirsInit.forEach(dir => {
  const gitkeepPath = pathInit.join(process.cwd(), dir, '.gitkeep');
  if (!fsInit.existsSync(gitkeepPath)) {
    fsInit.writeFileSync(gitkeepPath, '');
    console.log(`✅ Created .gitkeep in: ${dir}`);
  }
});

console.log('✅ Upload directories ready!');