import Classifier from "../components/Classifier";
import { openUrl } from '@tauri-apps/plugin-opener';
import { motion } from "framer-motion";

export default function Upload() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-[3vh] flex flex-col items-center"
    >
      <p className="mb-[4vh] text-lg">
        Upload audio files for genre classification with Essentia's{" "}
        <span 
          className="cursor-pointer hover:text-gray-terminal-light transition-colors duration-200" 
          onClick={() => { openUrl("https://essentia.upf.edu/models.html") }}
        >
          genre_discogs400-discogs-effnet
        </span>{" "}
        model.
      </p>
      <Classifier />
    </motion.div>
  );
}
