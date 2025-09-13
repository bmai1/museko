
export default function FileUpload() {
  return (
    <div className="upload-box cursor-pointer rounded-xl border border-gray-500 hover:!border-red-500 z-10 p-12 text-center">
      <div className="mb-4 text-4xl">⬆️</div>
      <p>Drag and drop audio file</p>
      <p className="text-sm text-gray-400">or</p>
      <button className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 text-gray-500">
        Browse your files
      </button>
    </div>
  );
}
