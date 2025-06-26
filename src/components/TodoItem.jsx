import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Check } from "lucide-react";

const TodoItem = ({ todo, onUpdate, onDelete }) => {
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

  const toggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className={`glass-effect rounded-xl p-4 hover:bg-white hover:bg-opacity-10 ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleComplete}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            todo.completed
              ? "bg-primary-500 border-primary-500 shadow-lg shadow-primary-500 shadow-opacity-25"
              : "border-gray-400 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500 hover:shadow-opacity-10"
          }`}
        >
          {todo.completed && <Check size={12} className="text-white" />}
        </motion.button>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent border-none outline-none text-white input-focus"
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className={`cursor-pointer block ${
                todo.completed
                  ? "line-through text-gray-400"
                  : "text-white hover:text-primary-300"
              }`}
            >
              {todo.text}
            </span>
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

export default TodoItem;
