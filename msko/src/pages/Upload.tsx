import Draggable from 'react-draggable';
import Classifier from "../components/Classifier";
import { openUrl } from '@tauri-apps/plugin-opener';
import { useRef } from 'react';

export default function Upload() {
  const nodeRef = useRef(null);
  return (
    <div className="mt-[3vh] flex flex-col items-center">
      <p className="text-l mb-3 text-gray-terminal-light">
        Upload your audio file for genre classification using Essentia's{" "}
        <span 
          className="cursor-pointer hover:text-white transition-colors duration-200" 
          onClick={() => { openUrl("https://essentia.upf.edu/models.html") }}
        >
          genre_discogs400-discogs-effnet
        </span>{" "}
        model.
      </p>
      
      <Draggable
        nodeRef={nodeRef}
      >
        <div 
          ref={nodeRef}
          className="bg-gradient-to-br from-indigo-200 to-pink-200 shadow-lg shadow-white/20 mt-[3vh] rounded-xl w-200 h-150 z-10 bg-black flex items-center justify-center"
        >
          <Classifier />
        </div>
      </Draggable>
    </div>
  );
}
