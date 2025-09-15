import { useDropzone } from "react-dropzone";
import { invoke, convertFileSrc } from '@tauri-apps/api/core';

export default function FileUpload() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length == 1) {
        // clone uploaded file msko/src/assets/audio (since can't get absolute path from dropzone)
        const file = acceptedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const bytes = Array.from(new Uint8Array(arrayBuffer));

        await invoke("save_file", { filename: file.name, bytes });
        await invoke("classify", { filename: file.name });
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`file-upload ${isDragActive ? "bg-gray-500 border-white" : ""} rounded-xl border border-gray-500 p-12 text-center`}
    >
      <input {...getInputProps()} />
      <p>Drag and drop audio file here</p>
      <p className="text-sm text-gray-400">or</p>
      <button className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 text-gray-500">Browse your files</button>
    </div>
  );
}
