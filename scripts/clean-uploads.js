const fs = require('fs');
const path = require('path');

const dryRun = process.argv.includes('--dry-run');

console.log(dryRun ? '🔍 Dry run mode - no files will be deleted' : '🧹 Cleaning upload directories...');

const uploadDirs = [
  'public/uploads/avatars'
];

let totalDeleted = 0;

uploadDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) return;

  const files = fs.readdirSync(fullPath);
  
  files.forEach(file => {
    if (file === '.gitkeep') return;
    
    const filePath = path.join(fullPath, file);
    const stats = fs.statSync(filePath);
    
    // Delete files older than 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    if (stats.mtimeMs < thirtyDaysAgo) {
      if (dryRun) {
        console.log(`📄 Would delete: ${dir}/${file}`);
      } else {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted: ${dir}/${file}`);
      }
      totalDeleted++;
    }
  });
});

console.log(dryRun 
  ? `🔍 Dry run complete. Would delete ${totalDeleted} file(s)`
  : `✅ Cleanup complete. Deleted ${totalDeleted} file(s)`
);