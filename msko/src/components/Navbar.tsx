export default function Navbar({ page, setPage }) {
  const navItems = [
    { name: "Upload", value: "upload" },
    { name: "Download", value: "download" },
    { name: "Library", value: "library" },
    { name: "Explore", value: "explore" },
  ];
  return (
    <nav className="mx-auto mt-8 flex w-fit justify-center space-x-6 rounded-full border border-gray-500 p-4">
      {navItems.map((item) => (
        <button
          key={item.value}
          onClick={() => setPage(item.value)}
          className={`cursor-pointer transition-colors duration-200 ${page === item.value ? "text-white" : "text-gray-500"}`}
        >
          {item.name}
        </button>
      ))}
    </nav>
  );
}
