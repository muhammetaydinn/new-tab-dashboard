import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Target } from "lucide-react";

const CounterTodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

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

  const increment = () => {
    const newCount = Math.min(todo.currentCount + 1, todo.targetCount);
    onUpdate(todo.id, { currentCount: newCount });
  };

  const decrement = () => {
    const newCount = Math.max(todo.currentCount - 1, 0);
    onUpdate(todo.id, { currentCount: newCount });
  };

  const progressPercentage = (todo.currentCount / todo.targetCount) * 100;
  const isCompleted = todo.currentCount >= todo.targetCount;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className={`glass-effect rounded-xl p-4 hover:bg-opacity-10 ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="space-y-4">
        {/* Ana Todo Başlığı */}
        <div className="flex items-center gap-3">
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

          {/* Progress Display */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div
                className="text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {todo.currentCount}/{todo.targetCount}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {Math.round(progressPercentage)}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
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

        {/* Counter Controls */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={decrement}
            disabled={todo.currentCount <= 0}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Minus size={20} />
          </motion.button>

          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {todo.currentCount}
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Tamamlandı
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={increment}
            disabled={todo.currentCount >= todo.targetCount}
            className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Target Display */}
        <div className="text-center">
          <div
            className="flex items-center justify-center gap-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            <Target size={16} />
            <span>Hedef: {todo.targetCount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CounterTodoItem;
