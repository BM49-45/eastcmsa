const fs = require('fs');
const path = require('path');

let css = '/* Auto-generated dynamic classes */\n\n';

// Generate 0-100 classes for progress fill
for (let i = 0; i <= 100; i++) {
  css += `.progress-fill[data-width="${i}"] { width: ${i}%; }\n`;
}

css += '\n';

// Generate 0-100 classes for audio progress
for (let i = 0; i <= 100; i++) {
  css += `.audio-progress-fill[data-width="${i}"] { width: ${i}%; }\n`;
}

css += '\n';

// Generate 0-100 classes for progress knob
for (let i = 0; i <= 100; i++) {
  css += `.progress-knob[data-position="${i}"] { left: ${i}%; }\n`;
}

css += '\n';

// Generate 0-100 classes for volume slider
for (let i = 0; i <= 100; i++) {
  css += `.volume-slider-custom[data-volume="${i}"] { background: linear-gradient(to right, #10b981 ${i}%, #4b5563 ${i}%); }\n`;
}

// Save to file
const outputPath = path.join(__dirname, 'GeneratedClasses.css');
fs.writeFileSync(outputPath, css);
console.log(`✅ Generated CSS classes to: ${outputPath}`);