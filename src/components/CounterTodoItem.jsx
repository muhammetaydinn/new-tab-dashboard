import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Target, Edit, Check } from "lucide-react";

const CounterTodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [editTarget, setEditTarget] = useState(todo.targetCount.toString());
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);
  const [editCurrent, setEditCurrent] = useState(todo.currentCount.toString());

  const incrementIntervalRef = useRef(null);
  const decrementIntervalRef = useRef(null);

  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };

  const handleTextBlur = () => {
    if (editText.trim() !== todo.text) {
      onUpdate(todo.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTextBlur();
    }
  };

  const handleTargetChange = (e) => {
    setEditTarget(e.target.value);
  };

  const handleTargetBlur = () => {
    const newTarget = parseInt(editTarget) || 1;
    if (newTarget !== todo.targetCount) {
      onUpdate(todo.id, { targetCount: newTarget });
    }
    setIsEditingTarget(false);
  };

  const handleTargetKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTargetBlur();
    }
  };

  const handleCurrentChange = (e) => {
    setEditCurrent(e.target.value);
  };

  const handleCurrentBlur = () => {
    const newCurrent = parseInt(editCurrent) || 0;
    const clampedCurrent = Math.max(0, Math.min(newCurrent, todo.targetCount));
    if (clampedCurrent !== todo.currentCount) {
      onUpdate(todo.id, { currentCount: clampedCurrent });
    }
    setIsEditingCurrent(false);
  };

  const handleCurrentKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCurrentBlur();
    }
  };

  const toggleCompleted = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const increment = () => {
    const newCount = Math.min(todo.currentCount + 1, todo.targetCount);
    onUpdate(todo.id, { currentCount: newCount });
  };

  const decrement = () => {
    const newCount = Math.max(todo.currentCount - 1, 0);
    onUpdate(todo.id, { currentCount: newCount });
  };

  // Otomatik artırma - daha hızlı
  const startIncrement = () => {
    increment();
    incrementIntervalRef.current = setInterval(() => {
      increment();
    }, 80); // 80ms aralıklarla (daha hızlı)
  };

  const stopIncrement = () => {
    if (incrementIntervalRef.current) {
      clearInterval(incrementIntervalRef.current);
      incrementIntervalRef.current = null;
    }
  };

  // Otomatik azaltma - daha hızlı
  const startDecrement = () => {
    decrement();
    decrementIntervalRef.current = setInterval(() => {
      decrement();
    }, 80); // 80ms aralıklarla (daha hızlı)
  };

  const stopDecrement = () => {
    if (decrementIntervalRef.current) {
      clearInterval(decrementIntervalRef.current);
      decrementIntervalRef.current = null;
    }
  };

  const progressPercentage = (todo.currentCount / todo.targetCount) * 100;
  const isCompleted = todo.currentCount >= todo.targetCount;

  // Progress ile birlikte yeşil rengin yoğunluğunu artır
  const greenOpacity = 0.1 + (progressPercentage / 100) * 0.4; // 0.1'den 0.5'e
  const greenIntensity = 0.15 + (progressPercentage / 100) * 0.35; // 0.15'ten 0.5'e

  // Düzenleme sırasında gerçek zamanlı progress hesaplama
  const currentProgressValue = isEditingCurrent
    ? parseInt(editCurrent) || 0
    : todo.currentCount;
  const realTimeProgressPercentage =
    (currentProgressValue / todo.targetCount) * 100;
  const realTimeGreenOpacity = 0.1 + (realTimeProgressPercentage / 100) * 0.4;
  const realTimeGreenIntensity =
    0.15 + (realTimeProgressPercentage / 100) * 0.35;
  const realTimeIsCompleted = currentProgressValue >= todo.targetCount;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className={`rounded-xl p-4 hover:bg-opacity-10 relative overflow-hidden ${
        realTimeIsCompleted ? "opacity-60" : ""
      }`}
      style={{
        background: `linear-gradient(90deg, rgba(34, 197, 94, ${realTimeGreenOpacity}) ${realTimeProgressPercentage}%, var(--glass-bg) ${realTimeProgressPercentage}%)`,
        backdropFilter: "blur(16px)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Progress Background */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-out"
        style={{
          background: `linear-gradient(90deg, rgba(34, 197, 94, ${realTimeGreenIntensity}) ${realTimeProgressPercentage}%, transparent ${realTimeProgressPercentage}%)`,
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Ana Todo Başlığı */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent border-none outline-none input-focus font-medium"
              style={{ color: "var(--text-primary)" }}
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="cursor-pointer block font-medium hover:text-primary-300"
              style={{ color: "var(--text-primary)" }}
            >
              {todo.text}
            </span>
          )}
        </div>

        {/* Current/Target Display */}
        <div className="flex items-center gap-2 min-w-[60px] justify-center">
          {isEditingCurrent ? (
            <input
              type="number"
              value={editCurrent}
              onChange={handleCurrentChange}
              onBlur={handleCurrentBlur}
              onKeyPress={handleCurrentKeyPress}
              className="w-8 bg-transparent border-none outline-none text-center text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
              min="0"
              max={todo.targetCount}
              autoFocus
            />
          ) : (
            <div
              className="text-lg font-bold cursor-pointer hover:text-primary-400 transition-colors"
              style={{ color: "var(--text-primary)" }}
              onClick={() => setIsEditingCurrent(true)}
              title="Düzenlemek için tıklayın"
            >
              {todo.currentCount}
            </div>
          )}
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            /
          </span>
          {isEditingTarget ? (
            <input
              type="number"
              value={editTarget}
              onChange={handleTargetChange}
              onBlur={handleTargetBlur}
              onKeyPress={handleTargetKeyPress}
              className="w-8 bg-transparent border-none outline-none text-center font-medium"
              style={{ color: "var(--text-primary)" }}
              min="1"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-1">
              <span
                className="text-sm font-medium cursor-pointer hover:text-primary-400"
                style={{ color: "var(--text-primary)" }}
                onClick={() => setIsEditingTarget(true)}
              >
                {todo.targetCount}
              </span>
              <Edit size={12} style={{ color: "var(--text-secondary)" }} />
            </div>
          )}
        </div>

        {/* Counter Controls - Horizontal */}
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={startDecrement}
            onMouseUp={stopDecrement}
            onMouseLeave={stopDecrement}
            onTouchStart={startDecrement}
            onTouchEnd={stopDecrement}
            disabled={todo.currentCount <= 0}
            className="p-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 select-none"
          >
            <Minus size={14} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={startIncrement}
            onMouseUp={stopIncrement}
            onMouseLeave={stopIncrement}
            onTouchStart={startIncrement}
            onTouchEnd={stopIncrement}
            disabled={todo.currentCount >= todo.targetCount}
            className="p-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 select-none"
          >
            <Plus size={14} />
          </motion.button>
        </div>

        {/* Completed Status Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCompleted}
          className={`p-2 rounded-lg transition-all duration-200 ${
            todo.completed
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-600"
          }`}
          title={todo.completed ? "Tamamlandı" : "Tamamlandı olarak işaretle"}
        >
          <Check size={16} />
        </motion.button>

        {/* Delete Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(todo.id)}
          className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400 hover:bg-opacity-20"
          title="Sil"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CounterTodoItem;
