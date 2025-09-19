import { useState } from "react";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload";
import Download from "./pages/Download";
import Library from "./pages/Library";
import Explore from "./pages/Explore";

import "./App.css";

function App() {
  const [page, setPage] = useState("upload");

  return (
    <div className="min-h-screen text-white bg-black">
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
