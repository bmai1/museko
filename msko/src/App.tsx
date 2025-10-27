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
  const [page, setPage] = useState();

  return (
    <div className="text-white">
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: slideUp ? "-100%" : 0, opacity: slideUp ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-center"
      >
        <h1 className="mb-8 text-6xl font-bold bg-gradient-to-r from-indigo-300 to-pink-300 hover:from-indigo-500 hover:to-pink-500 transition duration-750 bg-clip-text text-transparent">museko</h1>
        <button
          onClick={() => setSlideUp(true)}
          className="cursor-pointer px-6 py-2 text-gray-terminal-light hover:text-white transition-colors duration-200"
        >
          let’s get started.
        </button>
      </motion.div>
      <Navbar page={page} setPage={setPage} setSlideUp={setSlideUp} />
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
