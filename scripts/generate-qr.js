const QRCode = require('qrcode')
const fs = require('fs')

const url = process.argv[2] || 'https://eastcmsa.vercel.app'
const outputPath = 'public/qr-code.png'

console.log('📱 Generating QR Code...\n')

QRCode.toFile(outputPath, url, {
  color: {
    dark: '#10b981',
    light: '#ffffff'
  },
  width: 500,
  margin: 2,
  errorCorrectionLevel: 'H'
}, (err) => {
  if (err) {
    console.error('❌ Error generating QR code:', err)
    process.exit(1)
  }
  console.log('✅ QR code generated successfully!')
  console.log(`📍 URL: ${url}`)
  console.log(`📁 Saved at: ${outputPath}`)
  console.log('\n🎉 Scan QR code with your phone to open the app!')
})