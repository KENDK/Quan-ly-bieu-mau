import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, Save, X, BookOpen, Calendar, MapPin, Users, PlusCircle, Trash } from 'lucide-react';
import type { Exam, TrainingType } from '../types/schema';

interface ExamsViewProps {
  exams: Exam[];
  trainingTypes: TrainingType[];
  activeExamId: string;
  onSelectExam: (id: string) => void;
  onSave: (item: Exam) => void;
  onDelete: (id: string) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams,
  trainingTypes,
  activeExamId,
  onSelectExam,
  onSave,
  onDelete
}) => {
  const [editingItem, setEditingItem] = useState<Partial<Exam> | null>(null);
  const [subjectInput, setSubjectInput] = useState('');

  const handleCreateNew = () => {
    setEditingItem({
      id: `ex-${Date.now()}`,
      code: '',
      name: '',
      trainingTypeId: trainingTypes[0]?.id || '',
      cohort: 'Khóa 2024-2026',
      examDate: new Date().toISOString().split('T')[0],
      location: 'Hội trường chính',
      totalSubjects: 4,
      totalRooms: 6,
      studentsPerRoom: 35,
      subjectsList: ['Môn 1: Triết học Mác - Lênin', 'Môn 2: Kinh tế Chính trị'],
      status: 'planning'
    });
  };

  const handleAddSubject = () => {
    if (!subjectInput.trim()) return;
    const current = editingItem?.subjectsList || [];
    setEditingItem({
      ...editingItem,
      subjectsList: [...current, subjectInput.trim()],
      totalSubjects: current.length + 1
    });
    setSubjectInput('');
  };

  const handleRemoveSubject = (index: number) => {
    const current = editingItem?.subjectsList || [];
    const updated = current.filter((_, i) => i !== index);
    setEditingItem({
      ...editingItem,
      subjectsList: updated,
      totalSubjects: updated.length
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.code || !editingItem?.name || !editingItem?.trainingTypeId) {
      alert('Vui lòng điền đầy đủ Mã, Tên kỳ thi và Loại hình đào tạo');
      return;
    }
    const saved: Exam = {
      id: editingItem.id || `ex-${Date.now()}`,
      code: editingItem.code.trim().toUpperCase(),
      name: editingItem.name.trim(),
      trainingTypeId: editingItem.trainingTypeId,
      cohort: editingItem.cohort || '',
      examDate: editingItem.examDate || new Date().toISOString().split('T')[0],
      location: editingItem.location || '',
      totalSubjects: editingItem.subjectsList?.length || editingItem.totalSubjects || 0,
      totalRooms: Number(editingItem.totalRooms) || 0,
      studentsPerRoom: Number(editingItem.studentsPerRoom) || 0,
      subjectsList: editingItem.subjectsList || [],
      status: editingItem.status || 'planning',
      createdAt: editingItem.createdAt || new Date().toISOString()
    };
    onSave(saved);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            Quản Lý Các Kỳ Thi Tốt Nghiệp
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cấu hình thuộc tính kỳ thi: Khóa tốt nghiệp, Ngày thi, Số phòng, Số môn, Sinh viên/phòng
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Tạo Kỳ Thi Mới
        </button>
      </div>

      {/* Modal / Form Edit */}
      {editingItem && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingItem.createdAt ? 'Cập Nhật Thông Tin Kỳ Thi' : 'Tạo Kỳ Thi Mới'}
            </h3>
            <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Kỳ Thi (*)</label>
                <input
                  type="text"
                  placeholder="VD: KTHI-LLCT-K72"
                  value={editingItem.code || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Loại Hình Đào Tạo (*)</label>
                <select
                  value={editingItem.trainingTypeId || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, trainingTypeId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {trainingTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khóa Tốt Nghiệp (*)</label>
                <input
                  type="text"
                  placeholder="VD: Khóa 72 (2024-2026)"
                  value={editingItem.cohort || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, cohort: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Đầy Đủ Kỳ Thi (*)</label>
                <input
                  type="text"
                  placeholder="VD: Kỳ thi Tốt nghiệp Lớp Cao cấp Lý luận Chính trị..."
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày Thi / Thời Gian</label>
                <input
                  type="date"
                  value={editingItem.examDate || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, examDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Lượng Phòng Thi</label>
                <input
                  type="number"
                  min={1}
                  value={editingItem.totalRooms || 1}
                  onChange={(e) => setEditingItem({ ...editingItem, totalRooms: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số SV / Mỗi Phòng Thi</label>
                <input
                  type="number"
                  min={1}
                  value={editingItem.studentsPerRoom || 30}
                  onChange={(e) => setEditingItem({ ...editingItem, studentsPerRoom: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa Điểm Tổ Chức</label>
                <input
                  type="text"
                  placeholder="VD: Nhà Học A..."
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Dynamic Subjects Sub-form */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Danh Sách Các Môn Thi Tốt Nghiệp ({editingItem.subjectsList?.length || 0} môn)
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập tên môn thi (VD: Môn 1: Triết học Mác - Lênin)..."
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Thêm Môn
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {editingItem.subjectsList?.map((sub, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(idx)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
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
                <Save className="w-4 h-4" /> Lưu Kỳ Thi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Exams */}
      <div className="space-y-4">
        {exams.map(e => {
          const tt = trainingTypes.find(t => t.id === e.trainingTypeId);
          const isSelected = e.id === activeExamId;

          return (
            <div
              key={e.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition ${
                isSelected ? 'border-2 border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {e.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{tt?.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Đang chọn làm việc
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{e.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {!isSelected && (
                    <button
                      onClick={() => onSelectExam(e.id)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      Chọn Kỳ Thi Này
                    </button>
                  )}
                  <button
                    onClick={() => setEditingItem(e)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Xác nhận xóa kỳ thi "${e.name}"?`)) onDelete(e.id);
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600 pt-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Khóa: <strong>{e.cohort}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Thời gian: <strong>{e.examDate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Địa điểm: <strong>{e.location}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Qui mô: <strong>{e.totalRooms} phòng ({e.studentsPerRoom} SV/phòng)</strong></span>
                </div>
              </div>

              {/* Subjects tags */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Các môn thi tốt nghiệp ({e.subjectsList?.length || 0}):</span>
                {e.subjectsList?.map((s, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
