const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
// Tafuta logo katika public/logo.png
const inputImage = path.join(process.cwd(), 'public', 'logo.png')

if (!fs.existsSync(inputImage)) {
  console.error('❌ Logo not found at public/logo.png!')
  console.log('📥 Please download your logo first:')
  console.log('   curl -o public/logo.png "https://pub-7729259c73e646759f7039886bf31b23.r2.dev/image/logo.png"')
  process.exit(1)
}

// Create icons directory
const iconsDir = path.join(process.cwd(), 'public', 'icons')
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

console.log('🎨 Generating app icons from logo...\n')

// Generate icons for each size
sizes.forEach(size => {
  sharp(inputImage)
    .resize(size, size, { fit: 'contain', background: { r: 16, g: 185, b: 129, alpha: 1 } })
    .png()
    .toFile(path.join(iconsDir, `icon-${size}.png`))
    .then(() => console.log(`✅ Generated icon-${size}.png`))
    .catch(err => console.error(`❌ Error generating icon-${size}.png:`, err))
})

// Generate apple touch icon (180x180)
sharp(inputImage)
  .resize(180, 180, { fit: 'contain', background: { r: 16, g: 185, b: 129, alpha: 1 } })
  .png()
  .toFile(path.join(process.cwd(), 'public', 'apple-icon.png'))
  .then(() => console.log('✅ Generated apple-icon.png'))
  .catch(err => console.error('❌ Error generating apple-icon:', err))

console.log('\n🎉 Icons generation completed!')
console.log('📁 Icons saved in: public/icons/')
console.log('🍎 Apple icon saved at: public/apple-icon.png')