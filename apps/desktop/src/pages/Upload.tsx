import Draggable from "react-draggable";
import Classifier from "../components/Classifier";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Upload({ setPage }) {
  const [processedFile, setProcessedFile] = useState(null);
  const nodeRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // for radial cursor gradient

  return (
    <motion.div
      initial={{ y: "0%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-[3vh] flex flex-col items-center"
    >
      <div className="mt-3 flex flex-col items-center">
        {!processedFile ? (
          <motion.p
            key="upload-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
          </motion.p>
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

      <Draggable nodeRef={nodeRef}>
        <div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setPos({ x, y });
          }}
          ref={nodeRef}
          className={`z-10 ml-[-25px] flex ${processedFile ? "h-150 w-200 mt-[3vh]" : "h-101 w-102 mt-[10vh]" } cursor-move items-center justify-center rounded-[30px] bg-indigo-300 transition-[colors,width,height] duration-500`}
          style={{
            backgroundImage: `radial-gradient(circle at ${pos.x}px ${pos.y}px, #fccee8, transparent 100%)`,
          }}
        >
          <Classifier
            processedFile={processedFile}
            setProcessedFile={setProcessedFile}
          />
        </div>
      </Draggable>
    </motion.div>
  );
}
