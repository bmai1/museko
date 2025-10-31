import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload";
import Download from "./pages/Download";
import Library from "./pages/Library";
import Explore from "./pages/Explore";

import "./App.css";

function App() {
  const [slideUp, setSlideUp] = useState(false);
  const [page, setPage] = useState("upload");

  return (
    <div className="text-white">
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: slideUp ? "-100%" : 0, opacity: slideUp ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-center"
      >
        <h1 className="mb-8 bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-6xl font-bold text-transparent transition duration-750 hover:from-indigo-500 hover:to-pink-500">
          museko
        </h1>
        <button
          onClick={() => setSlideUp(true)}
          className="text-gray-terminal-light cursor-pointer px-6 py-2 transition-colors duration-200 hover:text-white"
        >
          let’s get started.
        </button>
      </motion.div>
      <Navbar page={page} setPage={setPage} setSlideUp={setSlideUp} />
      <main className="p-6">
        {page === "upload" && <Upload setPage={setPage} />}
        {page === "download" && <Download />}
        {page === "library" && <Library />}
        {page === "explore" && <Explore />}
      </main>
    </div>
  );
}

export default App;
