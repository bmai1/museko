import { motion } from "framer-motion";

export default function Explore() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-[3vh] flex flex-col items-center"
    >
      <h2 className="mb-4 text-xl">GENERATE RANDOM DISCOGS RELEASES</h2>
    </motion.div>
  );
}

