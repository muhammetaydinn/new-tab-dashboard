import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MotivationalHeader from "./components/MotivationalHeader";
import TodoSection from "./components/TodoSection";
import CalendarWidget from "./components/CalendarWidget";
import { motivationalTexts } from "./data/motivationalTexts";

function App() {
  const [motivationalText, setMotivationalText] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalTexts.length);
    setMotivationalText(motivationalTexts[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Sol Kolon - Motivasyon ve Yapılacaklar */}
          <div className="lg:col-span-2 space-y-6">
            <MotivationalHeader text={motivationalText} />
            <TodoSection />
          </div>

          {/* Sağ Kolon - Takvim */}
          <div className="lg:col-span-1">
            <CalendarWidget />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
