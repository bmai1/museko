import { useRef, useState } from "react";

export default function FileUpload() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounter = useRef(0);
  
  return (
    <div 
      ref={ref}
      className={`file-upload ${
        isDragActive ? "bg-gray-500 border-white" : ""
      } cursor-pointer rounded-xl border border-gray-500 p-12 text-center`}
      onDragEnter={(e) => {
        e.preventDefault();
        dragCounter.current++;
        setIsDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        dragCounter.current--;
        if (dragCounter.current === 0) {
          setIsDragActive(false);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        dragCounter.current = 0;
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files?.length) {
          console.log("Dropped files:", files);
        }
      }}
    >
    
      <div className="mb-4 text-4xl">⬆️</div>
      <p>Drag and drop audio file</p>
      <p className="text-sm text-gray-400">or</p>
      <button 
        className="cursor-pointer rounded-lg bg-gray-700 px-4 py-2 text-gray-500"
        onClick={() => {
          console.log("HELP")
        }}
      >
        Browse your files
      </button>
    </div>
  );
}
