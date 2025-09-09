import { NextResponse } from 'next/server';
export async function GET() {
  const mode = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'supabase' : 'mock';
  return NextResponse.json({ ok: true, mode });
}