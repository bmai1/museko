import { FiUpload, FiDownload, FiBookOpen, FiCompass } from "react-icons/fi";

export default function Navbar({ page, setPage, setSlideUp }) {
  const navItems = [
    { name: "Upload", value: "upload", icon: <FiUpload /> },
    { name: "Download", value: "download", icon: <FiDownload /> },
    { name: "Library", value: "library", icon: <FiBookOpen /> },
    { name: "Explore", value: "explore", icon: <FiCompass /> },
  ];

  return (
    <nav className="border-gray-terminal-mid absolute z-49 mx-auto flex w-full justify-center space-x-10 border-b p-2">
      <div
        className="absolute left-5 cursor-pointer bg-white bg-clip-text text-xl font-bold text-transparent"
        onClick={() => setSlideUp(false)}
      >
        μseko
      </div>
      {navItems.map((item) => (
        <button
          key={item.value}
          onClick={() => setPage(item.value)}
          className={`flex cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-white ${
            page === item.value ? "text-white" : "text-gray-terminal-light"
          }`}
        >
          {item.icon}
          <span>{item.name}</span>
        </button>
      ))}
      <hr></hr>
    </nav>
  );
}
