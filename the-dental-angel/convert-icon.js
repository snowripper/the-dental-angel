const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const svgPath = path.join(assetsDir, 'dental-angel-icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function convertIcons() {
  try {
    // iOS icon - 1024x1024
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));
    console.log('Created icon.png (1024x1024) for iOS');

    // Android adaptive icon - 1024x1024 (will be masked by Android)
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('Created adaptive-icon.png (1024x1024) for Android');

    // Favicon - 48x48
    await sharp(svgBuffer)
      .resize(48, 48)
      .png()
      .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('Created favicon.png (48x48)');

    // Splash icon - 200x200
    await sharp(svgBuffer)
      .resize(200, 200)
      .png()
      .toFile(path.join(assetsDir, 'splash-icon.png'));
    console.log('Created splash-icon.png (200x200)');

    console.log('\nAll icons created successfully!');
  } catch (error) {
    console.error('Error converting icons:', error);
  }
}

convertIcons();
