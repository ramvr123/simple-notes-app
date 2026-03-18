"use server"

import { createServerSupabase } from "./supabase"

export async function getUser() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getUser()
  return data.user
}