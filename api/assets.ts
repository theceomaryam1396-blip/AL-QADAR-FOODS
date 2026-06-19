import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createReadStream, statSync } from 'fs';
import { join, extname, normalize } from 'path';

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
  // Try common locations for the capture group, fall back to parsing the URL.
  let assetPath = (request.query && (request.query[0] || request.query['0'])) as string | undefined;
  if (!assetPath && request.url) {
    try {
      const u = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
      const pathname = u.pathname || '';
      const match = pathname.match(/\/assets\/(.*)/);
      if (match) assetPath = decodeURIComponent(match[1]);
    } catch (err) {
      // ignore
    }
  }

  if (!assetPath) {
    response.status(404).send('Not found');
    return;
  }

  // Prevent path traversal
  const safePath = normalize(assetPath).replace(/^\.\/(\\|\/)/, '');
  const filePath = join(process.cwd(), 'dist', 'client', 'assets', safePath);
  try {
    const stats = statSync(filePath);
    if (!stats.isFile()) throw new Error('Not a file');

    const ext = extname(filePath).toLowerCase();
    response.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const stream = createReadStream(filePath);
    stream.pipe(response);
  } catch (error) {
    console.error('Asset not found:', filePath, error);
    response.status(404).send('Asset not found');
  }
}
