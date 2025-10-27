import { motion } from "framer-motion";

export default function Download() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-[3vh] flex flex-col items-center"
    >
      <h2 className="mb-4 text-xl">YT_DLP</h2>
    </motion.div>
  );
}
