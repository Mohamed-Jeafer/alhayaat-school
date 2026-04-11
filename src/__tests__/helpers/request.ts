import { NextRequest } from 'next/server';

export function jsonRequest(url: string, body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export function formDataRequest(url: string, fields: Record<string, string | File>): NextRequest {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return new NextRequest(url, { method: 'POST', body: formData });
}

export async function readJson(res: Response): Promise<unknown> {
  return res.json();
}
