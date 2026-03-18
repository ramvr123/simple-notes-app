import { createClient } from '@/utils/supabase/server'
import { getNotes, createNote } from '@/lib/notes'
import { deleteNote } from '@/lib/deleteNote'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import NotesList from "./NotesList";

export default async function Page({
  searchParams
}: {
  searchParams: { search?: string }
}) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const search = searchParams?.search ?? ''
  const notes = await getNotes(search)

  async function handleCreate(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    await createNote(title, content)
    revalidatePath('/')
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Simple Notes</h1>
      <form action="/logout" method="post" className="mb-6">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </form>
      {/* FORM ABOVE THE LIST */}
      <form action={handleCreate} className="mb-6 space-y-3">
        <input
          name="title"
          placeholder="Note title"
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Note content"
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
      </form>

      <form className="mb-4">
  <input
    type="text"
    name="search"
    placeholder="Search notes..."
    defaultValue={search}
    className="border px-2 py-1 rounded"
  />
  <button type="submit" className="ml-2 px-3 py-1 border rounded">
    Search
  </button>
</form>

      {/* LIST OF NOTES */}
      {notes.length === 0 && (
        <p className="text-gray-500">No notes yet.</p>
      )}

      <NotesList notes={notes} />
    </main>
  )
}