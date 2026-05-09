import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const QUALITY = 75; // Adjust 60–85 to balance quality vs size

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function compressImages() {
  const files = await readdir(PUBLIC_DIR);
  const webpFiles = files.filter(f => extname(f).toLowerCase() === '.webp');

  console.log(`\nFound ${webpFiles.length} .webp files in /public\n`);
  console.log(`Target quality: ${QUALITY}\n`);
  console.log('─'.repeat(70));

  let totalOriginal = 0;
  let totalCompressed = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of webpFiles) {
    const filePath = join(PUBLIC_DIR, file);

    const originalStat = await stat(filePath);
    const originalSize = originalStat.size;

    try {
      // Read original into buffer, compress in memory, write back directly
      const inputBuffer = await readFile(filePath);
      const outputBuffer = await sharp(inputBuffer)
        .webp({ quality: QUALITY })
        .toBuffer();

      const compressedSize = outputBuffer.byteLength;

      if (compressedSize < originalSize) {
        await writeFile(filePath, outputBuffer);
        const saved = originalSize - compressedSize;
        const pct = ((saved / originalSize) * 100).toFixed(1);
        console.log(
          `SUCCESS: ${basename(file).padEnd(45)} ${formatBytes(originalSize).padStart(8)} -> ${formatBytes(compressedSize).padStart(8)}  (-${pct}%)`
        );
        totalOriginal += originalSize;
        totalCompressed += compressedSize;
      } else {
        console.log(`OPTIMAL: ${basename(file).padEnd(45)} already optimal, skipped`);
        skipped++;
        totalOriginal += originalSize;
        totalCompressed += originalSize;
      }
    } catch (err) {
      console.error(`FAILED: ${file} -- ${err.message}`);
      failed++;
      totalOriginal += originalSize;
      totalCompressed += originalSize;
    }
  }

  console.log('─'.repeat(70));
  const totalSaved = totalOriginal - totalCompressed;
  const totalPct = ((totalSaved / totalOriginal) * 100).toFixed(1);
  console.log(`\nTotal original size  : ${formatBytes(totalOriginal)}`);
  console.log(`Total compressed size: ${formatBytes(totalCompressed)}`);
  console.log(`Total saved          : ${formatBytes(totalSaved)} (${totalPct}%)`);
  console.log(`Already optimal      : ${skipped} files`);
  console.log(`Failed               : ${failed} files\n`);
}

compressImages().catch(console.error);
