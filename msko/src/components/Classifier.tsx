import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { appDataDir, join } from '@tauri-apps/api/path';
import { IoCloudUploadOutline } from "react-icons/io5";

function FileUpload({ onFileProcessed }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length == 1) {

        // console.log(BaseDirectory.AppData);

        const file = acceptedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const bytes = Array.from(new Uint8Array(arrayBuffer));

        await invoke("save_file", { filename: file.name, bytes });
        await invoke("classify", { filename: file.name });

        // // switch to genre plot
        onFileProcessed(file.name);
      }
    },
  });

  return (
  <div
    {...getRootProps()}
    className="cursor-pointer relative w-100 h-100 file-upload rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-1 overflow-hidden transition-all"
  >
    <div className="absolute inset-0 rounded-[30px] bg-gray-terminal transition-opacity duration-500" />
    <div
      className={`absolute inset-0 rounded-[30px] bg-white transition-opacity duration-500 ${
        isDragActive ? "opacity-30" : "opacity-0"
      }`}
    />
    <input {...getInputProps()} className="relative z-10" />

    <IoCloudUploadOutline size={150} className="relative z-10 mx-auto" />
    <p className="relative z-10 text-xl font-bold">Drag and Drop</p>
    <p className="relative z-10 text-lg text-gray-terminal-light">or</p>
    <button className="relative z-10 cursor-pointer rounded-[30px] bg-gray-terminal-mid py-1.5 px-5 text-lg text-gray-terminal-light hover:text-white transition-colors duration-200">
      Browse files
    </button>
    <p className="relative z-10 text-[15px] text-gray-terminal-light">.mp3, .flac, .wav</p>
  </div>
);
}

function GenrePlot({ filename }) {
  const [plotPath, setPlotPath] = useState<string | null>(null);
  useEffect(() => {
    async function resolvePath() {
      const appDataDirPath = await appDataDir();
      const filePath = await join(appDataDirPath, `/plots/${filename.slice(0, -4)}.png`);
      console.log(filePath);
      setPlotPath(convertFileSrc(filePath));
    }
      resolvePath();
  }, [filename]);
    
  return (
    <div>
      <h2 className="mb-2 truncate w-100">Predicted genres for {filename}</h2>
      {plotPath ? (
        <img
          src={plotPath}
          alt="Genre plot"
          className="rounded-lg shadow"
        />
      ) : (
        <p>Loading plot...</p>
      )}
    </div>
  );
}

export default function Classifier() {
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  return (
    <div className="">
      {processedFile ? (
        <GenrePlot filename={processedFile} />
      ) : (
        <FileUpload onFileProcessed={setProcessedFile} />
      )}
    </div>
  );
}