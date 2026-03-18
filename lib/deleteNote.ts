"use server"

import { createServerSupabase } from "@/app/actions/supabase"

export async function deleteNote(id: string) {
  const supabase = await createServerSupabase()

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw error
}