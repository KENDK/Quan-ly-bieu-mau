import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  UserPlus, 
  Save, 
  X, 
  ShieldCheck,
  FileText,
  Upload,
  Eye,
  FileCheck
} from 'lucide-react';
import type { Exam, ExamBoard, BoardMemberAssignment, Personnel } from '../types/schema';
import { storage } from '../services/storage';

interface BoardsManagementViewProps {
  activeExam: Exam | undefined;
  boards: ExamBoard[];
  personnel: Personnel[];
  onSaveBoard: (board: ExamBoard) => void;
  onDeleteBoard: (id: string) => void;
  onRefreshData: () => void;
}

export const BoardsManagementView: React.FC<BoardsManagementViewProps> = ({
  activeExam,
  boards,
  personnel,
  onSaveBoard,
  onDeleteBoard,
  onRefreshData
}) => {
  const [editingBoard, setEditingBoard] = useState<Partial<ExamBoard> | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string>(boards[0]?.id || '');
  
  // Assignment sub-form state
  const [editingAssignment, setEditingAssignment] = useState<Partial<BoardMemberAssignment> | null>(null);

  if (!activeExam) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-200">
        <p className="text-slate-500">Vui lòng chọn một Kỳ thi để quản lý các Ban và phân công nhân sự.</p>
      </div>
    );
  }

  const activeBoard = boards.find(b => b.id === selectedBoardId) || boards[0];
  const assignments = activeBoard ? storage.getAssignments(activeBoard.id) : [];

  const handleCreateBoard = () => {
    setEditingBoard({
      id: `b-${Date.now()}`,
      examId: activeExam.id,
      boardCode: 'COI_THI',
      boardName: '',
      description: ''
    });
  };

  const handleSaveBoardForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBoard?.boardName || !editingBoard?.boardCode) {
      alert('Vui lòng điền Mã Ban và Tên Ban');
      return;
    }
    const saved: ExamBoard = {
      id: editingBoard.id || `b-${Date.now()}`,
      examId: activeExam.id,
      boardCode: editingBoard.boardCode.trim().toUpperCase(),
      boardName: editingBoard.boardName.trim(),
      description: editingBoard.description || '',
      createdAt: editingBoard.createdAt || new Date().toISOString()
    };
    onSaveBoard(saved);
    setEditingBoard(null);
    setSelectedBoardId(saved.id);
  };

  // Assignment handlers
  const handleOpenAssignModal = () => {
    if (!activeBoard) return;
    setEditingAssignment({
      id: `as-${Date.now()}`,
      examBoardId: activeBoard.id,
      personnelId: personnel[0]?.id || '',
      roleName: 'Ủy viên',
      assignedSubject: '',
      notes: ''
    });
  };

  const handleSaveAssignmentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment?.personnelId || !editingAssignment?.roleName) {
      alert('Vui lòng chọn Cán bộ và Vai trò trong Ban');
      return;
    }
    storage.saveAssignment({
      id: editingAssignment.id || `as-${Date.now()}`,
      examBoardId: activeBoard.id,
      personnelId: editingAssignment.personnelId,
      roleName: editingAssignment.roleName.trim(),
      assignedSubject: editingAssignment.assignedSubject || '',
      notes: editingAssignment.notes || ''
    });
    setEditingAssignment(null);
    onRefreshData();
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm('Xác nhận rút cán bộ khỏi Ban này?')) {
      storage.deleteAssignment(id);
      onRefreshData();
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeBoard) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Vui lòng chọn tệp định dạng PDF!');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Pdf = reader.result as string;
        const updatedBoard: ExamBoard = {
          ...activeBoard,
          pdfFile: base64Pdf,
          pdfStatus: 'uploaded',
          pdfUploadedAt: new Date().toISOString()
        };
        onSaveBoard(updatedBoard);
        alert(`Đã tải lên và lưu hồ sơ PDF scan đã ký cho "${activeBoard.boardName}"!`);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert('Lỗi tải file PDF: ' + err.message);
    }
  };

  // Calculate overlap warnings (Personnel assigned to > 1 board in this exam)
  const allExamAssignments = boards.flatMap(b => storage.getAssignments(b.id));
  const personnelBoardCounts: Record<string, string[]> = {};
  allExamAssignments.forEach(as => {
    const board = boards.find(b => b.id === as.examBoardId);
    const boardName = board ? board.boardName : 'Ban không xác định';
    if (!personnelBoardCounts[as.personnelId]) {
      personnelBoardCounts[as.personnelId] = [];
    }
    if (!personnelBoardCounts[as.personnelId].includes(boardName)) {
      personnelBoardCounts[as.personnelId].push(boardName);
    }
  });

  const overlapWarnings = Object.entries(personnelBoardCounts)
    .filter(([_, boardNames]) => boardNames.length > 1)
    .map(([pId, boardNames]) => {
      const p = personnel.find(x => x.id === pId);
      return {
        personnelName: p ? `${p.academicTitle ? p.academicTitle + ' ' : ''}${p.fullName}` : 'Cán bộ',
        boards: boardNames
      };
    });

  // Calculate unassigned exam subjects
  const assignedSubjectsList = allExamAssignments.map(as => (as.assignedSubject || '').toLowerCase());
  const unassignedSubjects = (activeExam.subjectsList || []).filter(sub => {
    const subClean = sub.toLowerCase();
    return !assignedSubjectsList.some(as => as.includes(subClean) || subClean.includes(as));
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {activeExam.code}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Cơ Cấu Các Ban & Phân Công Vai Trò Thành Viên
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập Ban coi thi, Ban đề thi, Ban phách... và gán vị trí (Trưởng ban, Phó ban, Thư ký, Trưởng môn thi)
          </p>
        </div>

        <button
          onClick={handleCreateBoard}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Thêm Ban Mới
        </button>
      </div>

      {/* Safety Validation Warning Alerts */}
      {(overlapWarnings.length > 0 || unassignedSubjects.length > 0) && (
        <div className="space-y-3">
          {/* Overlap Warning Alert Banner */}
          {overlapWarnings.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-800 text-xs uppercase tracking-wider">
                  ⚠️ Cảnh báo phân công trùng lặp ({overlapWarnings.length} cán bộ kiêm nhiệm)
                </span>
              </div>
              <ul className="text-xs text-amber-900 list-disc list-inside space-y-0.5">
                {overlapWarnings.map((w, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{w.personnelName}</span> được phân công tại {w.boards.length} ban: {w.boards.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unassigned Subject Warning Alert Banner */}
          {unassignedSubjects.length > 0 && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl shadow-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-800 text-xs uppercase tracking-wider">
                  🚨 Cảnh báo chưa phân công môn thi ({unassignedSubjects.length} môn)
                </span>
              </div>
              <p className="text-xs text-rose-900">
                Các môn thi chưa có cán bộ phụ trách: <span className="font-semibold">{unassignedSubjects.join(', ')}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Board Edit Modal */}
      {editingBoard && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingBoard.createdAt ? 'Cập Nhật Thông Tin Ban' : 'Thêm Ban Mới Trong Kỳ Thi'}
            </h3>
            <button onClick={() => setEditingBoard(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveBoardForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Nhóm Ban (*)</label>
                <select
                  value={editingBoard.boardCode || 'COI_THI'}
                  onChange={(e) => setEditingBoard({ ...editingBoard, boardCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DE_THI">DE_THI - Ban Đề thi</option>
                  <option value="COI_THI">COI_THI - Ban Coi thi</option>
                  <option value="PHACH">PHACH - Ban Phách</option>
                  <option value="CHAM_THI">CHAM_THI - Ban Chấm thi</option>
                  <option value="GIAM_SAT">GIAM_SAT - Ban Kiểm tra Giám sát</option>
                  <option value="KHAC">KHAC - Ban chuyên trách khác</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Hiển Thị Của Ban (*)</label>
                <input
                  type="text"
                  placeholder="VD: Ban Coi thi Tốt nghiệp..."
                  value={editingBoard.boardName || ''}
                  onChange={(e) => setEditingBoard({ ...editingBoard, boardName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô Tả Nhiệm Vụ</label>
              <textarea
                rows={2}
                placeholder="Nhập mô tả nhiệm vụ của ban..."
                value={editingBoard.description || ''}
                onChange={(e) => setEditingBoard({ ...editingBoard, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingBoard(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                <Save className="w-4 h-4" /> Lưu Thông Tin Ban
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Boards Tabs & Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Column: List of Boards selector */}
        <div className="md:col-span-1 space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Danh Sách Các Ban ({boards.length})
          </label>

          {boards.map((b) => {
            const isSelected = b.id === (activeBoard?.id || '');
            const boardAssCount = storage.getAssignments(b.id).length;

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBoardId(b.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-indigo-600'
                    }`}>
                      {b.boardCode}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      b.pdfStatus === 'uploaded'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {b.pdfStatus === 'uploaded' ? 'Đã lưu hồ sơ' : 'Chờ ký duyệt'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mt-1">{b.boardName}</h4>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  {boardAssCount} NS
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Column: Personnel Assignment inside Selected Board */}
        <div className="md:col-span-3 space-y-4">
          {activeBoard ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Mã Ban: {activeBoard.boardCode}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{activeBoard.boardName}</h3>
                  <p className="text-xs text-slate-500">{activeBoard.description || 'Chưa có mô tả'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAssignModal}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition"
                  >
                    <UserPlus className="w-4 h-4" /> Phân Công Cán Bộ
                  </button>
                  <button
                    onClick={() => setEditingBoard(activeBoard)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    title="Sửa tên/mô tả ban"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Xác nhận xóa "${activeBoard.boardName}"?`)) onDeleteBoard(activeBoard.id);
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Xóa ban này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF Scan Upload & Archive Portfolio Control Panel */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    activeBoard.pdfStatus === 'uploaded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hồ Sơ PDF Scan Đã Ký Duyệt</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeBoard.pdfStatus === 'uploaded' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {activeBoard.pdfStatus === 'uploaded' ? 'Đã lưu hồ sơ' : 'Chờ ký duyệt'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeBoard.pdfStatus === 'uploaded' && activeBoard.pdfUploadedAt
                        ? `Đã lưu hồ sơ lúc: ${new Date(activeBoard.pdfUploadedAt).toLocaleString('vi-VN')}`
                        : 'Chưa có bản scan PDF đính kèm cho Ban này'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {activeBoard.pdfFile ? (
                    <>
                      <a
                        href={activeBoard.pdfFile}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem PDF
                      </a>
                      <a
                        href={activeBoard.pdfFile}
                        download={`Ho_So_Scan_${activeBoard.boardCode}_${activeExam.code}.pdf`}
                        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                      >
                        <FileCheck className="w-3.5 h-3.5" /> Tải Hồ Sơ PDF
                      </a>
                      <label className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" /> Đổi File
                        <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                      </label>
                    </>
                  ) : (
                    <label className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer transition shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload PDF Scan Đã Ký</span>
                      <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>
                  )}
                </div>
              </div>

              {/* Assignment Edit Sub-modal */}
              {editingAssignment && (
                <div className="bg-slate-50 p-5 rounded-xl border border-indigo-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      Phân Công Thành Viên Vào {activeBoard.boardName}
                    </h4>
                    <button onClick={() => setEditingAssignment(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveAssignmentForm} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn Cán Bộ (*)</label>
                        <select
                          value={editingAssignment.personnelId || ''}
                          onChange={(e) => setEditingAssignment({ ...editingAssignment, personnelId: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          {personnel.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.academicTitle ? p.academicTitle + ' ' : ''}{p.fullName} - {p.department} ({p.position || 'Giảng viên'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Vai Trò Trong Ban (*)</label>
                        <select
                          value={editingAssignment.roleName || 'Ủy viên'}
                          onChange={(e) => setEditingAssignment({ ...editingAssignment, roleName: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="Trưởng Ban">Trưởng Ban</option>
                          <option value="Phó Trưởng Ban">Phó Trưởng Ban</option>
                          <option value="Trưởng Môn thi">Trưởng Môn thi</option>
                          <option value="Thư ký">Thư ký</option>
                          <option value="Phản biện">Phản biện</option>
                          <option value="Cán bộ coi thi">Cán bộ coi thi</option>
                          <option value="Cán bộ chấm phách">Cán bộ chấm phách</option>
                          <option value="Cán bộ chấm thi">Cán bộ chấm thi</option>
                          <option value="Ủy viên">Ủy viên</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Môn Thi Phụ Trách</label>
                        {activeExam.subjectsList && activeExam.subjectsList.length > 0 ? (
                          <select
                            value={editingAssignment.assignedSubject || ''}
                            onChange={(e) => setEditingAssignment({ ...editingAssignment, assignedSubject: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">-- Không chọn môn thi cụ thể --</option>
                            {activeExam.subjectsList.map((sub, sIdx) => (
                              <option key={sIdx} value={sub}>{sub}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="VD: Triết học Mác - Lênin..."
                            value={editingAssignment.assignedSubject || ''}
                            onChange={(e) => setEditingAssignment({ ...editingAssignment, assignedSubject: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi Chú</label>
                        <input
                          type="text"
                          placeholder="VD: Trực phòng thi A1..."
                          value={editingAssignment.notes || ''}
                          onChange={(e) => setEditingAssignment({ ...editingAssignment, notes: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingAssignment(null)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" /> Lưu Phân Công
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">STT</th>
                      <th className="py-3 px-3">Họ và Tên Cán Bộ</th>
                      <th className="py-3 px-3">Đơn Vị Công Tác</th>
                      <th className="py-3 px-3">Vai Trò Trong Ban</th>
                      <th className="py-3 px-3">Phụ Trách / Ghi Chú</th>
                      <th className="py-3 px-3 text-right">Rút Khỏi Ban</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {assignments.length > 0 ? (
                      assignments.map((as, idx) => {
                        const p = personnel.find(x => x.id === as.personnelId);
                        const isLeader = as.roleName.toLowerCase().includes('trưởng ban');

                        return (
                          <tr key={as.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-3 font-medium text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              <span className="flex items-center gap-1.5">
                                {isLeader && <ShieldCheck className="w-4 h-4 text-amber-500" />}
                                {p ? (p.academicTitle ? p.academicTitle + ' ' : '') + p.fullName : 'N/A'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-600 text-xs">{p ? p.department : 'N/A'}</td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                                isLeader
                                  ? 'bg-amber-100 text-amber-800'
                                  : as.roleName.includes('Phó')
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {as.roleName}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-500 text-xs">{as.assignedSubject || as.notes || '---'}</td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleDeleteAssignment(as.id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded transition"
                                title="Gỡ cán bộ này"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                          Chưa phân công cán bộ nào vào ban này. Nhấn "Phân Công Cán Bộ" ở trên để gán nhân sự.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl text-center text-slate-400 border border-slate-200">
              Vui lòng chọn hoặc tạo một Ban để quản lý thành viên.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
