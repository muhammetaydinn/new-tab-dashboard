import React from "react";
import { motion } from "framer-motion";

const MotivationalHeader = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-effect rounded-2xl p-8 text-center relative overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 from-opacity-10 to-transparent opacity-50"></div>

      <div className="relative z-10">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {text.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < text.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 text-primary-400 text-sm font-medium"
        >
          Bugün harika bir gün olacak! ✨
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MotivationalHeader;
