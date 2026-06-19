import type { VercelRequest, VercelResponse } from '@vercel/node';
import { join } from 'path';
import { pathToFileURL } from 'url';

function toWebRequest(request: VercelRequest): Request {
  const host = request.headers.host ?? 'localhost';
  const url = new URL(request.url ?? '/', `https://${host}`);
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers || {})) {
    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    } else if (value !== undefined) {
      headers.set(key, String(value));
    }
  }

  let body: BodyInit | undefined;
  if (request.method && request.method !== 'GET' && request.method !== 'HEAD') {
    if ('rawBody' in request && request.rawBody) {
      body = request.rawBody as Buffer;
    } else if (typeof request.body === 'string' || Buffer.isBuffer(request.body)) {
      body = request.body as BodyInit;
    } else if (request.body != null) {
      body = JSON.stringify(request.body);
      headers.set('content-type', headers.get('content-type') ?? 'application/json');
    }
  }

  return new Request(url.toString(), {
    method: request.method,
    headers,
    body,
    duplex: 'half'
  });
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const serverPath = join(process.cwd(), 'dist', 'server', 'server.js');
    const serverModule = await import(pathToFileURL(serverPath).toString());
    const serverEntry = serverModule.default ?? serverModule;

    if (!serverEntry || typeof serverEntry.fetch !== 'function') {
      response.status(500).send('Invalid server entry.');
      return;
    }

    const webRequest = toWebRequest(request);
    const webResponse = await serverEntry.fetch(webRequest, {}, {});

    webResponse.headers.forEach((value, key) => {
      response.setHeader(key, value);
    });
    response.status(webResponse.status);

    const body = await webResponse.arrayBuffer();
    response.send(Buffer.from(body));
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error');
  }
}
