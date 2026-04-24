import { useState } from 'react';
import { Plus, ClipboardList, Trash2, Check, Tag as TagIcon, Settings2 } from 'lucide-react';
import { Tag, Task } from './types';
import TagManager from './TagManager';

const DEFAULT_TAGS: Tag[] = [
  { id: 1, name: 'Client A', color: '#3b82f6' },
  { id: 2, name: 'Client B', color: '#10b981' },
  { id: 3, name: 'Project X', color: '#f59e0b' },
  { id: 4, name: 'Personal', color: '#64748b' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [input, setInput] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [filterTagId, setFilterTagId] = useState<number | null | 'all'>('all');
  const [showTagManager, setShowTagManager] = useState(false);
  const [nextTagId, setNextTagId] = useState(100);

  // --- task actions ---
  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, { id: Date.now(), text: trimmed, completed: false, tagId: selectedTagId }]);
    setInput('');
    setSelectedTagId(null);
  }

  function handleToggle(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function handleDelete(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd();
  }

  // --- tag actions ---
  function handleAddTag(name: string, color: string) {
    const id = nextTagId;
    setNextTagId((n) => n + 1);
    setTags((prev) => [...prev, { id, name, color }]);
  }

  function handleEditTag(id: number, name: string, color: string) {
    setTags((prev) => prev.map((t) => (t.id === id ? { ...t, name, color } : t)));
  }

  function handleDeleteTag(id: number) {
    setTags((prev) => prev.filter((t) => t.id !== id));
    setTasks((prev) => prev.map((t) => (t.tagId === id ? { ...t, tagId: null } : t)));
    if (filterTagId === id) setFilterTagId('all');
    if (selectedTagId === id) setSelectedTagId(null);
  }

  // --- derived ---
  const tagMap = new Map(tags.map((t) => [t.id, t]));
  const tagCounts = new Map(tags.map((t) => [t.id, tasks.filter((task) => task.tagId === t.id).length]));
  const visibleTasks =
    filterTagId === 'all'
      ? tasks
      : filterTagId === null
      ? tasks.filter((t) => t.tagId === null)
      : tasks.filter((t) => t.tagId === filterTagId);

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
        <div className="flex gap-2 mb-3">
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

        {/* Tag selector for new task */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <TagIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <button
            onClick={() => setSelectedTagId(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              selectedTagId === null
                ? 'bg-gray-200 text-gray-700'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            No tag
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTagId(tag.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                selectedTagId === tag.id ? 'opacity-100' : 'opacity-60 hover:opacity-80'
              }`}
              style={
                selectedTagId === tag.id
                  ? { backgroundColor: tag.color + '22', borderColor: tag.color, color: tag.color }
                  : { backgroundColor: 'transparent', borderColor: tag.color + '60', color: tag.color }
              }
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-gray-400 font-medium mr-1">Filter:</span>
          <button
            onClick={() => setFilterTagId('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              filterTagId === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            All ({tasks.length})
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilterTagId(filterTagId === tag.id ? 'all' : tag.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition border"
              style={
                filterTagId === tag.id
                  ? { backgroundColor: tag.color, borderColor: tag.color, color: '#fff' }
                  : { backgroundColor: '#fff', borderColor: tag.color + '60', color: tag.color }
              }
            >
              {tag.name} ({tagCounts.get(tag.id) ?? 0})
            </button>
          ))}
          <button
            onClick={() => setShowTagManager(true)}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Manage
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {visibleTasks.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm select-none">
              {filterTagId === 'all' ? 'Add your first task above.' : 'No tasks with this tag.'}
            </div>
          ) : (
            visibleTasks.map((task) => {
              const tag = task.tagId != null ? tagMap.get(task.tagId) : undefined;
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggle(task.id)}
                  className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-gray-100 shadow-sm group cursor-pointer select-none hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div
                    onClick={(e) => { e.stopPropagation(); handleToggle(task.id); }}
                    className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition ${
                      task.completed
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>

                  <span
                    className={`flex-1 text-sm transition ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>

                  {tag && (
                    <span
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{ backgroundColor: tag.color + '1a', color: tag.color }}
                    >
                      {tag.name}
                    </span>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showTagManager && (
        <TagManager
          tags={tags}
          onAdd={handleAddTag}
          onEdit={handleEditTag}
          onDelete={handleDeleteTag}
          onClose={() => setShowTagManager(false)}
        />
      )}
    </div>
  );
}
