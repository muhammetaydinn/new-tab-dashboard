import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Check, Plus, Minus } from "lucide-react";

const StepTodoItem = ({ todo, onUpdate, onDelete }) => {
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

  const toggleStep = (stepIndex) => {
    const updatedSteps = [...todo.steps];
    updatedSteps[stepIndex].completed = !updatedSteps[stepIndex].completed;
    onUpdate(todo.id, { steps: updatedSteps });
  };

  const addStep = () => {
    const newStep = {
      id: Date.now(),
      text: `Adım ${todo.steps.length + 1}`,
      completed: false,
    };
    const updatedSteps = [...todo.steps, newStep];
    onUpdate(todo.id, { steps: updatedSteps });
  };

  const removeStep = (stepIndex) => {
    if (todo.steps.length > 1) {
      const updatedSteps = todo.steps.filter((_, index) => index !== stepIndex);
      onUpdate(todo.id, { steps: updatedSteps });
    }
  };

  const updateStepText = (stepIndex, newText) => {
    const updatedSteps = [...todo.steps];
    updatedSteps[stepIndex].text = newText;
    onUpdate(todo.id, { steps: updatedSteps });
  };

  const completedSteps = todo.steps.filter((step) => step.completed).length;
  const progressPercentage = (completedSteps / todo.steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className={`glass-effect rounded-xl p-4 hover:bg-opacity-10 ${
        completedSteps === todo.steps.length ? "opacity-60" : ""
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

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {completedSteps}/{todo.steps.length}
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
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

        {/* Adımlar */}
        <div className="space-y-2">
          {todo.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-opacity-5"
              style={{
                backgroundColor: step.completed
                  ? "rgba(34, 197, 94, 0.1)"
                  : "transparent",
              }}
            >
              {/* Step Checkbox */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleStep(index)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  step.completed
                    ? "bg-primary-500 border-primary-500 shadow-lg shadow-primary-500 shadow-opacity-25"
                    : "border-gray-400 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500 hover:shadow-opacity-10"
                }`}
              >
                {step.completed && <Check size={10} className="text-white" />}
              </motion.button>

              {/* Step Text */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={step.text}
                  onChange={(e) => updateStepText(index, e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm"
                  style={{
                    color: step.completed
                      ? "var(--text-secondary)"
                      : "var(--text-primary)",
                    textDecoration: step.completed ? "line-through" : "none",
                  }}
                />
              </div>

              {/* Remove Step Button */}
              {todo.steps.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeStep(index)}
                  className="text-gray-400 hover:text-red-400 p-1 rounded"
                  title="Adımı sil"
                >
                  <Minus size={14} />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add Step Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addStep}
          className="flex items-center gap-2 text-primary-500 hover:text-primary-400 text-sm font-medium p-2 rounded-lg hover:bg-primary-500 hover:bg-opacity-10 transition-all duration-200"
        >
          <Plus size={16} />
          Adım Ekle
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StepTodoItem;
