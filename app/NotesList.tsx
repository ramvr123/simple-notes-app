"use client";

import { useState, useTransition } from "react";

export default function NotesList({
  notes,
  onDelete,
}: {
  notes: any[];
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  let filteredNotes = [...notes];

  if (filter === "az") {
    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (filter === "za") {
    filteredNotes.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (filter === "newest") {
    filteredNotes.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }

  if (filter === "oldest") {
    filteredNotes.sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );
  }

  return (
    <div>
      {/* FILTER DROPDOWN */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="all">All notes</option>
        <option value="az">Title A–Z</option>
        <option value="za">Title Z–A</option>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>

      <ul className="space-y-4">
        {filteredNotes.map((note) => (
          <li key={note.id} className="border p-4 rounded">
            <h2 className="font-semibold">{note.title}</h2>
            <p className="text-sm text-gray-700">{note.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(note.created_at).toLocaleString()}
            </p>

            <a
              href={`/notes/${note.id}/edit`}
              className="text-blue-600 text-sm mr-4"
            >
              Edit
            </a>

            <button
              onClick={() =>
                startTransition(() => onDelete(note.id))
              }
              className="text-red-600 text-sm"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}