import { motion } from "framer-motion";
import Draggable from "react-draggable";
import ReleaseGenerator from "../components/ReleaseGenerator"
import { useRef } from "react";

export default function Explore() {
  const nodeRef = useRef(null);
  return (
    <motion.div className="mt-[3vh] flex flex-col items-center">
      <h2 className="mb-4 text-xl">GENERATE RANDOM DISCOGS RELEASES</h2>
      <Draggable nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          className="ml-[-25px] flex h-100, w-100 cursor-move items-center justify-center rounded-[30px] bg-gray-terminal transition-[width, height] duration 500s" 
        >
          <ReleaseGenerator />
        </div>
      </Draggable>
    </motion.div>
  );
}
