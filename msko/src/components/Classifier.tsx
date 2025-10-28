import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { invoke, convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, join } from "@tauri-apps/api/path";
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

        // switch to genre plot
        onFileProcessed(file.name);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="relative flex h-100 w-100 cursor-pointer flex-col items-center justify-center space-y-1 overflow-hidden rounded-xl text-center transition-all"
    >
      <div className="bg-gray-terminal absolute inset-0 rounded-[30px] transition-opacity duration-500" />
      <div
        className={`absolute inset-0 rounded-[30px] bg-white transition-opacity duration-500 ${
          isDragActive ? "opacity-30" : "opacity-0"
        }`}
      />
      <input {...getInputProps()} className="relative z-10" />

      <IoCloudUploadOutline size={150} className="relative mx-auto" />
      <p className="relative z-10 text-xl font-bold">Drag and Drop</p>
      <p className="text-gray-terminal-light relative z-10 text-lg">or</p>
      <button className="text-gray-terminal-light relative z-10 cursor-pointer rounded-[30px] bg-black/50 px-5 py-3 transition-colors duration-200 hover:text-white">
        Browse files
      </button>
      <p className="text-gray-terminal-light relative z-10 text-[15px]">
        .mp3, .flac, .wav
      </p>
    </div>
  );
}

function GenrePlot({ filename }) {
  const [plotPath, setPlotPath] = useState<string | null>(null);
  useEffect(() => {
    async function resolvePath() {
      const appDataDirPath = await appDataDir();
      const filePath = await join(
        appDataDirPath,
        `/plots/${filename.slice(0, -4)}.png`,
      );
      console.log(filePath);
      setPlotPath(convertFileSrc(filePath));
    }
    resolvePath();
  }, [filename]);

  return (
    <div>
      <h2 className="mb-2 w-170 truncate text-black">
        Top 10 predicted genres for {filename}:
      </h2>
      {plotPath ? (
        <img
          src={plotPath}
          alt="Genre plot"
          className="pointer-events-none rounded-lg opacity-95"
        />
      ) : (
        <p>Loading plot...</p>
      )}
    </div>
  );
}

type fileProps = {
  processedFile: string | null;
  setProcessedFile: (value: string | null) => void;
};

export default function Classifier({
  processedFile,
  setProcessedFile,
}: fileProps) {
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
