import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Save, X, Search } from 'lucide-react';
import type { GlobalSubject } from '../types/schema';

interface GlobalSubjectsViewProps {
  subjects: GlobalSubject[];
  onSave: (item: GlobalSubject) => void;
  onDelete: (id: string) => void;
}

export const GlobalSubjectsView: React.FC<GlobalSubjectsViewProps> = ({
  subjects,
  onSave,
  onDelete
}) => {
  const [editingItem, setEditingItem] = useState<Partial<GlobalSubject> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateNew = () => {
    setEditingItem({
      id: `gs-${Date.now()}`,
      code: '',
      name: '',
      description: ''
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.code || !editingItem?.name) {
      alert('Vui lòng điền đầy đủ Mã môn và Tên môn thi');
      return;
    }
    onSave({
      id: editingItem.id || `gs-${Date.now()}`,
      code: editingItem.code.trim().toUpperCase(),
      name: editingItem.name.trim(),
      description: editingItem.description?.trim() || '',
      createdAt: editingItem.createdAt || new Date().toISOString()
    });
    setEditingItem(null);
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Thư Viện Môn Thi Dùng Chung
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Danh mục các môn thi toàn trường dùng để chọn khi thiết lập kỳ thi tốt nghiệp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm môn thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Thêm Môn Thi
          </button>
        </div>
      </div>

      {/* Modal / Form Edit */}
      {editingItem && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingItem.createdAt ? 'Cập Nhật Môn Thi' : 'Thêm Môn Thi Mới'}
            </h3>
            <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Môn Thi (*)</label>
                <input
                  type="text"
                  placeholder="VD: XDD, THMLN..."
                  value={editingItem.code || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-semibold text-indigo-700"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Môn Thi (*)</label>
                <input
                  type="text"
                  placeholder="VD: Xây dựng Đảng & Chính quyền nhà nước..."
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô Tả Chuyên Môn</label>
              <textarea
                rows={2}
                placeholder="VD: Môn thi thuộc khối kiến thức chuyên ngành..."
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                <Save className="w-4 h-4" /> Lưu Môn Thi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Global Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 transition space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                  Mã: {s.code}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-2">{s.name}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingItem(s)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Xác nhận xóa môn thi "${s.name}"?`)) onDelete(s.id);
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {s.description && (
              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                {s.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
