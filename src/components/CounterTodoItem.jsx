import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Target, Edit } from "lucide-react";

const CounterTodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [editTarget, setEditTarget] = useState(todo.targetCount.toString());

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

  const increment = () => {
    const newCount = Math.min(todo.currentCount + 1, todo.targetCount);
    onUpdate(todo.id, { currentCount: newCount });
  };

  const decrement = () => {
    const newCount = Math.max(todo.currentCount - 1, 0);
    onUpdate(todo.id, { currentCount: newCount });
  };

  // Otomatik artırma
  const startIncrement = () => {
    increment();
    incrementIntervalRef.current = setInterval(() => {
      increment();
    }, 150); // 150ms aralıklarla
  };

  const stopIncrement = () => {
    if (incrementIntervalRef.current) {
      clearInterval(incrementIntervalRef.current);
      incrementIntervalRef.current = null;
    }
  };

  // Otomatik azaltma
  const startDecrement = () => {
    decrement();
    decrementIntervalRef.current = setInterval(() => {
      decrement();
    }, 150); // 150ms aralıklarla
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
  const greenOpacity = 0.05 + (progressPercentage / 100) * 0.25; // 0.05'ten 0.3'e
  const greenIntensity = 0.1 + (progressPercentage / 100) * 0.2; // 0.1'den 0.3'e

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className={`rounded-xl p-4 hover:bg-opacity-10 relative overflow-hidden ${
        isCompleted ? "opacity-60" : ""
      }`}
      style={{
        background: `linear-gradient(90deg, rgba(34, 197, 94, ${greenOpacity}) ${progressPercentage}%, var(--glass-bg) ${progressPercentage}%)`,
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Progress Background */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-out"
        style={{
          background: `linear-gradient(90deg, rgba(34, 197, 94, ${greenIntensity}) ${progressPercentage}%, transparent ${progressPercentage}%)`,
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="flex items-center gap-3 relative z-10">
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

        {/* Progress Percentage */}
        <div className="text-center min-w-[50px]">
          <div
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {Math.round(progressPercentage)}%
          </div>
        </div>

        {/* Counter Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseDown={startDecrement}
            onMouseUp={stopDecrement}
            onMouseLeave={stopDecrement}
            onTouchStart={startDecrement}
            onTouchEnd={stopDecrement}
            disabled={todo.currentCount <= 0}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 select-none"
          >
            <Minus size={16} />
          </motion.button>

          <div className="text-center min-w-[40px]">
            <div
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {todo.currentCount}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseDown={startIncrement}
            onMouseUp={stopIncrement}
            onMouseLeave={stopIncrement}
            onTouchStart={startIncrement}
            onTouchEnd={stopIncrement}
            disabled={todo.currentCount >= todo.targetCount}
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 select-none"
          >
            <Plus size={16} />
          </motion.button>
        </div>

        {/* Target Display */}
        <div className="flex items-center gap-2">
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
              className="w-12 bg-transparent border-none outline-none text-center font-medium"
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
