import { createClient } from '@/utils/supabase/server'
import { updateNote } from '@/lib/updateNote'
import { redirect } from 'next/navigation'

export default async function EditNotePage(props: any) {
  const params = await props.params
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  

  const { data: note } = await supabase
  .from('notes')
  .select('*')
  .eq('id', params.id)
  .eq('user_id', user.id)   // ⭐ ADD THIS LINE
  .single()

  if (!note) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Note not found</h1>
    </main>
    )
  }

  async function handleUpdate(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    await updateNote(params.id, title, content)
    redirect('/')
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Note</h1>

      <form action={handleUpdate} className="space-y-3">
        <input
          name="title"
          defaultValue={note.title}
          className="border p-2 w-full rounded"
          required
        />

        <textarea
          name="content"
          defaultValue={note.content}
          className="border p-2 w-full rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </main>
  )
}