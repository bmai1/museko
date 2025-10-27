import { FiUpload, FiDownload, FiBookOpen, FiCompass } from "react-icons/fi";

export default function Navbar({ page, setPage }) {
  const navItems = [
    { name: "Upload", value: "upload", icon: <FiUpload /> },
    { name: "Download", value: "download", icon: <FiDownload /> },
    { name: "Library", value: "library", icon: <FiBookOpen /> },
    { name: "Explore", value: "explore", icon: <FiCompass /> },
  ];

  return (
    <nav className="mx-auto flex w-full justify-center space-x-10 p-2 border-b border-gray-terminal-mid">
      <div className="absolute left-5 text-xl font-bold text-white">μseko</div>
      {navItems.map((item) => (
        <button
          key={item.value}
          onClick={() => setPage(item.value)}
          className={`flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors duration-200 ${
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