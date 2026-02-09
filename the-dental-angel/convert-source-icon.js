const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const sourceImage = path.join(assetsDir, 'source-icon.png');

async function convertIcons() {
  try {
    // Get image info
    const metadata = await sharp(sourceImage).metadata();
    console.log(`Source image: ${metadata.width}x${metadata.height}`);

    // iOS icon - 1024x1024 (square, will crop/fit)
    await sharp(sourceImage)
      .resize(1024, 1024, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));
    console.log('Created icon.png (1024x1024) for iOS');

    // Android adaptive icon - 1024x1024
    await sharp(sourceImage)
      .resize(1024, 1024, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('Created adaptive-icon.png (1024x1024) for Android');

    // Favicon - 48x48
    await sharp(sourceImage)
      .resize(48, 48, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('Created favicon.png (48x48)');

    // Splash icon - 200x200
    await sharp(sourceImage)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(path.join(assetsDir, 'splash-icon.png'));
    console.log('Created splash-icon.png (200x200)');

    console.log('\nAll icons created successfully from your image!');
  } catch (error) {
    console.error('Error converting icons:', error);
  }
}

convertIcons();
