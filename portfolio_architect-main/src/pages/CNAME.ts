import type { APIRoute } from 'astro';
import { getSite } from '../lib/site';

export const GET: APIRoute = () => {
  const { domain } = getSite();
  if (domain.endsWith('.github.io')) return new Response(null, { status: 404 });
  return new Response(`${domain}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
