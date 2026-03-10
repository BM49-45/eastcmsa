import fs from 'fs'
import path from 'path'

interface CleanOptions {
  keepGitkeep: boolean
  dryRun: boolean
}

function cleanDirectory(dir: string, options: CleanOptions = { keepGitkeep: true, dryRun: false }): void {
  if (!fs.existsSync(dir)) {
    console.log(`📁 Directory does not exist: ${dir}`)
    return
  }

  const files = fs.readdirSync(dir)
  let deletedCount = 0
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    
    // Skip .gitkeep if keepGitkeep is true
    if (options.keepGitkeep && file === '.gitkeep') {
      console.log(`🔒 Keeping: ${filePath}`)
      return
    }
    
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      // Recursively clean subdirectories
      cleanDirectory(filePath, options)
      
      // Remove directory if empty
      const remainingFiles = fs.readdirSync(filePath)
      if (remainingFiles.length === 0 || (remainingFiles.length === 1 && remainingFiles[0] === '.gitkeep' && options.keepGitkeep)) {
        if (!options.dryRun) {
          fs.rmdirSync(filePath)
          console.log(`📁 Removed empty directory: ${filePath}`)
        } else {
          console.log(`📁 [DRY RUN] Would remove directory: ${filePath}`)
        }
      }
    } else {
      // Delete file
      if (!options.dryRun) {
        fs.unlinkSync(filePath)
        console.log(`🗑️ Deleted: ${filePath}`)
      } else {
        console.log(`🗑️ [DRY RUN] Would delete: ${filePath}`)
      }
      deletedCount++
    }
  })
  
  if (deletedCount > 0) {
    console.log(`✨ Deleted ${deletedCount} files from ${dir}`)
  }
}

function cleanUploads(): void {
  console.log('🧹 Cleaning upload directories...')
  
  const uploadDir = path.join(process.cwd(), 'public/uploads')
  const options: CleanOptions = {
    keepGitkeep: true,
    dryRun: process.argv.includes('--dry-run')
  }
  
  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be actually deleted')
  }
  
  // Clean avatars directory
  const avatarsDir = path.join(uploadDir, 'avatars')
  cleanDirectory(avatarsDir, options)
  
  // Add more directories here if needed
  // const otherDir = path.join(uploadDir, 'other')
  // cleanDirectory(otherDir, options)
  
  console.log('✅ Clean up completed!')
}

// Run the cleanup
try {
  cleanUploads()
} catch (error) {
  console.error('❌ Error cleaning upload directories:', error)
  process.exit(1)
}