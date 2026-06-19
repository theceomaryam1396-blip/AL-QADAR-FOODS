import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // The app is built and served via the default Vercel build process.
  // This placeholder exists so Vercel recognizes the project as a Node server deployment.
  response.status(200).send('AL-QADAR FOODS is deployed successfully.');
}
