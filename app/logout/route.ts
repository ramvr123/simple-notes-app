import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/app/actions/supabase'

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/login', request.url))
}

// ✅ ADD THIS
export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/login', request.url))
}