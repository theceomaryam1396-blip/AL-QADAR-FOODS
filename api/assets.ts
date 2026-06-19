import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createReadStream, statSync } from 'fs';
import { join, extname } from 'path';

const mimeTypes: Record<string, string> = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.map': 'application/json'
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const assetPath = request.query[0] as string;
  if (!assetPath) {
    response.status(404).send('Not found');
    return;
  }

  const filePath = join(process.cwd(), 'dist', 'client', 'assets', assetPath);
  try {
    const stats = statSync(filePath);
    if (!stats.isFile()) throw new Error('Not a file');

    const ext = extname(filePath).toLowerCase();
    response.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const stream = createReadStream(filePath);
    stream.pipe(response);
  } catch (error) {
    response.status(404).send('Asset not found');
  }
}
