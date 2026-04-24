import { useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';

interface Task {
  id: number;
  text: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, { id: Date.now(), text: trimmed }]);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 mb-4">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            {tasks.length === 0 ? 'No tasks yet' : `${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {/* Input area */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm select-none">
              Add your first task above.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                <span className="text-sm text-gray-800">{task.text}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
