import Classifier from "../components/Classifier";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Upload({ setPage }) {
  const [processedFile, setProcessedFile] = useState(null);
  const nodeRef = useRef(null);

  return (
    <div
      className="mt-[3vh] flex flex-col items-center"
    >
      <div className="mt-3 flex flex-col items-center">
        {!processedFile ? (
          <p
            className="text-l text-gray-terminal-light mt-10 mb-3 ml-[-25px]"
          >
            Upload your audio file for genre classification using Essentia's{" "}
            <span
              className="cursor-pointer hover:text-white"
              onClick={() => openUrl("https://essentia.upf.edu/models.html")}
            >
              genre_discogs400-discogs-effnet
            </span>{" "}
            model.
          </p>
        ) : (
          <motion.div
            key="upload-navbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className="border-gray-terminal-light mx-2 mt-7 ml-[-25px] cursor-pointer rounded-full border px-5 py-3"
              onClick={() => {
                setProcessedFile(null);
                setPage("upload");
              }}
            >
              Upload new file
            </button>
            <button className="border-gray-terminal-light mx-2 cursor-pointer rounded-full border px-5 py-3">
              View full taxonomy
            </button>
          </motion.div>
        )}
      </div>
        <div
  
          ref={nodeRef}
          className={`z-10 ml-[-25px] flex ${processedFile ? "h-150 w-200 mt-[3vh]" : "h-101 w-102 mt-[10vh]" } cursor-move items-center justify-center rounded-[30px]transition-[colors,width,height] duration-500`}
          style={{
            
          }}
        >
          <Classifier
            processedFile={processedFile}
            setProcessedFile={setProcessedFile}
          />
        </div>
    </div>
  );
}
