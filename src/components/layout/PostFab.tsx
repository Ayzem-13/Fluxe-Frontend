import { Plus } from "lucide-react";

export function PostFab() {
  return (
    <button
      aria-label="Poster"
      className="md:hidden fixed bottom-24 right-4 z-40 size-14 rounded-full bg-sky-500 hover:bg-sky-400 shadow-lg flex items-center justify-center transition-all active:scale-95"
    >
      <Plus className="size-7 text-white" strokeWidth={2.5} />
    </button>
  );
}
