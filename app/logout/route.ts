import { NextResponse, NextRequest } from 'next/server'
import { createServerSupabase } from '@/app/actions/supabase'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()

  return NextResponse.redirect(`${request.nextUrl.origin}/login`)
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(`${request.nextUrl.origin}/login`)
}