import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const WEBP_QUALITY = 75;
const AVIF_QUALITY = 60; // AVIF can use lower quality for similar visual results

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function processImage(fileName) {
  const filePath = join(PUBLIC_DIR, fileName);
  const ext = extname(fileName).toLowerCase();
  const name = fileName.replace(ext, '');
  
  // Skip if not an image we want to process
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return null;

  const originalStat = await stat(filePath);
  const originalSize = originalStat.size;
  const inputBuffer = await readFile(filePath);

  const results = [];

  // Generate WebP
  const webpBuffer = await sharp(inputBuffer)
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  const webpPath = join(PUBLIC_DIR, `${name}.webp`);
  await writeFile(webpPath, webpBuffer);
  results.push({ format: 'WebP', size: webpBuffer.byteLength });

  // Generate AVIF
  const avifBuffer = await sharp(inputBuffer)
    .avif({ quality: AVIF_QUALITY, effort: 4 }) // Effort 4 balances speed/compression
    .toBuffer();
  const avifPath = join(PUBLIC_DIR, `${name}.avif`);
  await writeFile(avifPath, avifBuffer);
  results.push({ format: 'AVIF', size: avifBuffer.byteLength });

  return {
    name: fileName,
    originalSize,
    webpSize: webpBuffer.byteLength,
    avifSize: avifBuffer.byteLength
  };
}

async function compressImages() {
  const files = await readdir(PUBLIC_DIR);
  const imageFiles = files.filter(f => ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase()));

  console.log(`\nFound ${imageFiles.length} source images in /public\n`);
  console.log('─'.repeat(80));
  console.log(`${'FILE'.padEnd(35)} ${'ORIGINAL'.padStart(10)} ${'WebP'.padStart(10)} ${'AVIF'.padStart(10)}`);
  console.log('─'.repeat(80));

  let totalOriginal = 0;
  let totalWebp = 0;
  let totalAvif = 0;

  for (const file of imageFiles) {
    try {
      const result = await processImage(file);
      if (!result) continue;

      console.log(
        `${result.name.padEnd(35)} ${formatBytes(result.originalSize).padStart(10)} ${formatBytes(result.webpSize).padStart(10)} ${formatBytes(result.avifSize).padStart(10)}`
      );

      totalOriginal += result.originalSize;
      totalWebp += result.webpSize;
      totalAvif += result.avifSize;
    } catch (err) {
      console.error(`FAILED: ${file} -- ${err.message}`);
    }
  }

  console.log('─'.repeat(80));
  console.log(`TOTALS:`.padEnd(35));
  console.log(`${'Original:'.padEnd(15)} ${formatBytes(totalOriginal)}`);
  console.log(`${'WebP:'.padEnd(15)} ${formatBytes(totalWebp)} (${((1 - totalWebp/totalOriginal) * 100).toFixed(1)}% saved)`);
  console.log(`${'AVIF:'.padEnd(15)} ${formatBytes(totalAvif)} (${((1 - totalAvif/totalOriginal) * 100).toFixed(1)}% saved)`);
  console.log('─'.repeat(80));
}

compressImages().catch(console.error);

