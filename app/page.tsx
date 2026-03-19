import { getNotes, createNote } from "@/lib/notes"
import { deleteNote } from "@/lib/deleteNote"
import { getUser } from "@/app/actions/getUser"
import { createServerSupabase } from "@/app/actions/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import NotesList from "./NotesList"

export default async function Page({ searchParams }: { searchParams: { search?: string } }) {
  // ✅ Get user safely through a server action
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  // ✅ Fetch notes
  const search = searchParams?.search ?? ""
  const notes = await getNotes(search)

  // ✅ Create note (server action)
  async function handleCreate(formData: FormData) {
    "use server"

    const title = formData.get("title") as string
    const content = formData.get("content") as string

    await createNote(title, content)
    revalidatePath("/")
  }

  // ✅ Delete note (server action)
  async function handleDelete(id: string) {
    "use server"

    await deleteNote(id)
    revalidatePath("/")
  }

  // ✅ LOGOUT (server action — FIXED)
  async function handleLogout() {
    "use server"

    const supabase = await createServerSupabase()
    await supabase.auth.signOut()

    redirect("/login")
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Simple Notes</h1>

      {/* ✅ LOGOUT FIXED */}
      <form action={handleLogout} className="mb-6">
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>

      {/* CREATE NOTE */}
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Note
        </button>
      </form>

      {/* SEARCH */}
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

      {/* EMPTY STATE */}
      {notes.length === 0 && <p className="text-gray-500">No notes yet.</p>}

      {/* NOTES LIST WITH DELETE ACTION */}
      <NotesList notes={notes} onDelete={handleDelete} />
    </main>
  )
}