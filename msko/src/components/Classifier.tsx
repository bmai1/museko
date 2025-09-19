import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { appDataDir, join } from '@tauri-apps/api/path';

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
      className={`w-[clamp(200px,50vw,800px)] h-[clamp(200px,50vh,800px)] file-upload ${isDragActive ? "bg-gray-500 border-white" : ""} rounded-xl border border-gray-500 p-12 text-center`}
    >
      <input {...getInputProps()} />
      <p className="mt-[3vh] text-[clamp(1rem,2vw,2.5rem)]">Drag and drop audio file here</p>
      <p className="text-[clamp(1rem,2vw,2.5rem)] mb-[1vh] text-gray-400">or</p>
      <button className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 text-[clamp(1rem,1.5vw,2rem)] text-gray-500">Browse your files</button>
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