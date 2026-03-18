import { createClient } from '@/utils/supabase/server'

export async function updateNote(id: string, title: string, content: string) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}