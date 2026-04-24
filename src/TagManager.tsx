import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Tag } from './types';

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#8b5cf6', '#ec4899', '#64748b',
];

interface Props {
  tags: Tag[];
  onAdd: (name: string, color: string) => void;
  onEdit: (id: number, name: string, color: string) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

interface EditState {
  id: number;
  name: string;
  color: string;
}

export default function TagManager({ tags, onAdd, onEdit, onDelete, onClose }: Props) {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [edit, setEdit] = useState<EditState | null>(null);

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed, newColor);
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
  }

  function handleEditSave() {
    if (!edit) return;
    const trimmed = edit.name.trim();
    if (!trimmed) return;
    onEdit(edit.id, trimmed, edit.color);
    setEdit(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Manage Tags</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Existing tags */}
          {tags.length > 0 && (
            <ul className="space-y-2">
              {tags.map((tag) =>
                edit?.id === tag.id ? (
                  <li key={tag.id} className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={edit.name}
                      onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-1">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEdit({ ...edit, color: c })}
                          className="w-5 h-5 rounded-full border-2 transition"
                          style={{
                            backgroundColor: c,
                            borderColor: edit.color === c ? '#1e40af' : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                    <button onClick={handleEditSave} className="text-blue-600 hover:text-blue-700 transition">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEdit(null)} className="text-gray-400 hover:text-gray-600 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ) : (
                  <li key={tag.id} className="flex items-center gap-2 group">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="flex-1 text-sm text-gray-800">{tag.name}</span>
                    <button
                      onClick={() => setEdit({ id: tag.id, name: tag.name, color: tag.color })}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(tag.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                )
              )}
            </ul>
          )}

          {/* Add new tag */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">New tag</p>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Tag name..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className="w-6 h-6 rounded-full border-2 transition"
                  style={{
                    backgroundColor: c,
                    borderColor: newColor === c ? '#1e40af' : 'transparent',
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Plus className="w-4 h-4" />
              Add Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
