import path from 'path';
import fs from 'mz/fs';
import sharp from 'sharp';
import crypto from 'crypto';

import config from '../../../config';

function sha1(data) {
  return crypto.createHash('sha1').update(data).digest('hex');
}

export default async function generateThumbnail(filePath) {
  let inputFile = path.resolve(config.directory, filePath);
  let outputFile = path.resolve(config.thumbDirectory,
    sha1(filePath) + path.extname(filePath));
  try {
    await fs.access(outputFile);
    return outputFile;
  } catch (err) {
    // Convert the file
    await sharp(inputFile)
      .rotate()
      .resize(480, null)
      .toFile(outputFile);
  }
  return outputFile;
}
