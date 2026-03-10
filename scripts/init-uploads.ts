import fs from 'fs'
import path from 'path'

const uploadDirs: string[] = [
  'public/uploads',
  'public/uploads/avatars'
]

function initializeUploadDirectories(): void {
  console.log('Initializing upload directories...')
  
  uploadDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir)
    
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
      console.log(`✅ Created directory: ${dir}`)
      
      // Create .gitkeep file
      const gitkeepPath = path.join(fullPath, '.gitkeep')
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '')
        console.log(`✅ Created .gitkeep in: ${dir}`)
      }
    } else {
      console.log(`📁 Directory already exists: ${dir}`)
      
      // Check if .gitkeep exists
      const gitkeepPath = path.join(fullPath, '.gitkeep')
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '')
        console.log(`✅ Added .gitkeep to: ${dir}`)
      }
    }
  })
  
  console.log('✅ Upload directories initialized successfully!')
}

// Run the initialization
try {
  initializeUploadDirectories()
} catch (error) {
  console.error('❌ Error initializing upload directories:', error)
  process.exit(1)
}