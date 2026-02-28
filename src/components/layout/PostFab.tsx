import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface PostFabProps {
  onCompose: () => void;
}

export function PostFab({ onCompose }: PostFabProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onCompose}
      aria-label="Poster"
      className="md:hidden fixed bottom-24 right-4 z-40 size-14 rounded-full bg-sky-500 hover:bg-sky-400 shadow-lg flex items-center justify-center transition-colors"
    >
      <Plus className="size-7 text-white" strokeWidth={2.5} />
    </motion.button>
  );
}
