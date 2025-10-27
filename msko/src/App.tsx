import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload";
import Download from "./pages/Download";
import Library from "./pages/Library";
import Explore from "./pages/Explore";

import "./App.css";


function Museko({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
    >
      <p className="text-lg text-white mb-2">This is</p>
      <h1 className="text-5xl font-bold mb-6">MUSEKO</h1>
      <button
        className="text-gray-terminal-light"
        onClick={onClose}
      >
        Let's get started
      </button>
    </motion.div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [page, setPage] = useState("upload");

  return (
    <div className="min-h-screen text-white bg-black">
      <AnimatePresence>
        {showIntro && (
          <Museko onClose={() => setShowIntro(false)} key="intro" />
        )}
      </AnimatePresence>
      <Navbar page={page} setPage={setPage} />
      <main className="p-6">
        {page === "upload" && <Upload />}
        {page === "download" && <Download />}
        {page === "library" && <Library />}
        {page === "explore" && <Explore />}
      </main>
    </div>
  );
}

export default App;
