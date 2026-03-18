import { createServerSupabase } from "@/app/actions/supabase"
import type { Note } from '@/types/notes'

export async function getNotes(search: string = '', filter: string = ''): Promise<Note[]> {
  const supabase = await createServerSupabase()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  if (filter === 'pinned') {
  query = query.eq('pinned', true)
}

  const { data, error } = await query

  if (error) {
    console.error('Error fetching notes:', error)
    return []
  }

  return data as Note[]
}

export async function createNote(title: string, content: string) {
  const supabase = await createServerSupabase()


  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      title,
      content,
      user_id: user.id
    })

  if (error) {
    console.error('Error creating note:', error)
    return null
  }

  return data
}