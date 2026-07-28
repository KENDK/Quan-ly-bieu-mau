import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Save, X } from 'lucide-react';
import type { TrainingType } from '../types/schema';

interface TrainingTypesViewProps {
  trainingTypes: TrainingType[];
  onSave: (item: TrainingType) => void;
  onDelete: (id: string) => void;
}

export const TrainingTypesView: React.FC<TrainingTypesViewProps> = ({
  trainingTypes,
  onSave,
  onDelete
}) => {
  const [editingItem, setEditingItem] = useState<Partial<TrainingType> | null>(null);

  const handleCreateNew = () => {
    setEditingItem({
      id: `tt-${Date.now()}`,
      code: '',
      name: '',
      description: ''
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.code || !editingItem?.name) {
      alert('Vui lòng nhập đầy đủ Mã và Tên loại hình đào tạo');
      return;
    }
    onSave({
      id: editingItem.id || `tt-${Date.now()}`,
      code: editingItem.code.trim().toUpperCase(),
      name: editingItem.name.trim(),
      description: editingItem.description || '',
      createdAt: editingItem.createdAt || new Date().toISOString()
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Quản Lý Loại Hình Đào Tạo
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Danh mục các loại hình đào tạo (Lý luận chính trị, Đại học, Bồi dưỡng...)
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Thêm Loại Hình Mới
        </button>
      </div>

      {/* Modal / Form Edit */}
      {editingItem && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingItem.createdAt ? 'Cập Nhật Loại Hình Đào Tạo' : 'Thêm Loại Hình Đào Tạo Mới'}
            </h3>
            <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Loại Hình (*)</label>
                <input
                  type="text"
                  placeholder="VD: LLCT, DH_CQ..."
                  value={editingItem.code || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Loại Hình Đào Tạo (*)</label>
                <input
                  type="text"
                  placeholder="VD: Cao cấp Lý luận chính trị..."
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô Tả Chức Năng</label>
              <textarea
                rows={2}
                placeholder="Nhập ghi chú hoặc phạm vi áp dụng..."
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
                <Save className="w-4 h-4" /> Lưu Loại Hình
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">STT</th>
              <th className="py-3.5 px-4">Mã</th>
              <th className="py-3.5 px-4">Tên Loại Hình Đào Tạo</th>
              <th className="py-3.5 px-4">Mô Tả</th>
              <th className="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {trainingTypes.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-medium text-slate-400">{idx + 1}</td>
                <td className="py-3.5 px-4 font-bold text-indigo-600">{item.code}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">{item.name}</td>
                <td className="py-3.5 px-4 text-slate-500 text-xs max-w-xs truncate">{item.description || '---'}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Xác nhận xóa loại hình "${item.name}"?`)) onDelete(item.id);
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
