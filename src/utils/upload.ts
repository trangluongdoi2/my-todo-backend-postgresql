import fs from 'fs';

export function fileToBuffer(filePath: any) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const chunks: any[] = [];

    fileStream.on('data', (chunk) => {
        chunks.push(chunk);
    });

    fileStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
      fileStream.destroy();
    });

    fileStream.on('error', (error) => {
        reject(error);
    });
  });
}