import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ strapi_url: process.env.NEXT_PUBLIC_STRAPI_URL || 'NOT_SET' });
}
