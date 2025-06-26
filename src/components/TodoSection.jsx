import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, ChevronDown, ChevronUp } from "lucide-react";
import TodoItem from "./TodoItem";

const TodoSection = () => {
  const [todos, setTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  // Local storage'dan yapılacakları yükle
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      setTodos(parsedTodos);
    }
  }, []);

  // Local storage'a kaydet
  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  // Yeni yapılacak ekle
  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: "Yeni görev",
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveTodos([...todos, newTodo]);
  };

  // Yapılacak güncelle
  const updateTodo = (id, updates) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    saveTodos(updatedTodos);
  };

  // Yapılacak sil
  const deleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(filteredTodos);
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-6"
    >
      {/* Ana Yapılacaklar Kartı */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Yapılacaklar</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTodo}
            className="button-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Ekle
          </motion.button>
        </div>

        {/* Aktif Yapılacaklar */}
        <div className="space-y-3">
          <AnimatePresence>
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Tamamlanan Yapılacaklar */}
        {completedTodos.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              {showCompleted ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
              Tamamlananlar ({completedTodos.length})
            </button>

            <AnimatePresence>
              {showCompleted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {completedTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={updateTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TodoSection;
