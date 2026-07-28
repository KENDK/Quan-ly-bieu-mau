import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Award, 
  FileText, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  MapPin, 
  BookOpen, 
  UserCheck 
} from 'lucide-react';
import type { Exam, ExamBoard, TrainingType, Personnel, FormTemplate } from '../types/schema';
import { storage } from '../services/storage';
import { exportAllExamFormsToZip, exportBoardFormsToZip } from '../services/bulkExporter';

interface DashboardViewProps {
  activeExam: Exam | undefined;
  exams: Exam[];
  trainingTypes: TrainingType[];
  personnel: Personnel[];
  boards: ExamBoard[];
  templates: FormTemplate[];
  setActiveTab: (tab: string) => void;
  onSelectExam: (examId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeExam,
  exams,
  trainingTypes,
  personnel,
  boards,
  templates,
  setActiveTab,
  onSelectExam
}) => {
  const activeTrainingType = trainingTypes.find(t => t.id === activeExam?.trainingTypeId);
  const assignments = activeExam ? storage.getAssignments() : [];

  const handleExportAll = async () => {
    if (!activeExam) return;
    try {
      await exportAllExamFormsToZip(activeExam);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xuất file');
    }
  };

  const handleExportBoard = async (board: ExamBoard) => {
    if (!activeExam) return;
    try {
      await exportBoardFormsToZip(activeExam, board);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xuất file');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hệ Thống Đã Sẵn Sàng Vận Hành
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Quản Lý Biểu Mẫu & Cơ Cấu Ban Kỳ Thi Tốt Nghiệp
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Tự động hóa toàn bộ việc lập biên bản, phân công vai trò (Trưởng ban, Phó ban, Thư ký, Trưởng môn) và tùy chỉnh mapping thông tin xuất file Word/PDF/Zip 1-Click.
            </p>
          </div>

          {activeExam && (
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/40 transition transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5" />
              <span>Xuất 1-Click Tất Cả (ZIP)</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Hệ Đào Tạo</p>
            <p className="text-xl font-bold text-slate-800">{trainingTypes.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng Nhân Sự</p>
            <p className="text-xl font-bold text-slate-800">{personnel.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng Kỳ Thi</p>
            <p className="text-xl font-bold text-slate-800">{exams.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Mẫu Biểu Mẫu</p>
            <p className="text-xl font-bold text-slate-800">{templates.length}</p>
          </div>
        </div>
      </div>

      {/* Active Exam Card Details */}
      {activeExam ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Kỳ Thi Đang Chọn
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{activeExam.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeExam.id}
                onChange={(e) => onSelectExam(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {exams.map(e => (
                  <option key={e.id} value={e.id}>
                    Chuyển sang: {e.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Loại hình: <strong>{activeTrainingType?.name || 'Chưa rõ'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Khóa tốt nghiệp: <strong>{activeExam.cohort}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Ngày thi: <strong>{activeExam.examDate}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Địa điểm: <strong>{activeExam.location}</strong></span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500 font-medium">Số Môn Thi</p>
              <p className="text-lg font-bold text-slate-800">{activeExam.totalSubjects} môn</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Số Phòng Thi</p>
              <p className="text-lg font-bold text-slate-800">{activeExam.totalRooms} phòng</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Số Sinh Viên / Phòng</p>
              <p className="text-lg font-bold text-slate-800">{activeExam.studentsPerRoom} SV</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Boards list & Quick board bulk export */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Danh Sách Các Ban Trong Kỳ Thi</h3>
            <p className="text-xs text-slate-500">Quản lý cơ cấu các ban & xuất biểu mẫu theo từng ban</p>
          </div>
          <button
            onClick={() => setActiveTab('boards')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Quản lý cơ cấu Ban <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map(b => {
            const boardAssignments = assignments.filter(a => a.examBoardId === b.id);
            const boardTemplates = templates.filter(t => t.boardCode === b.boardCode || t.boardCode === 'GENERAL');

            return (
              <div key={b.id} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition bg-gradient-to-b from-white to-slate-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {b.boardCode}
                    </span>
                    <h4 className="font-bold text-slate-800 text-base mt-1">{b.boardName}</h4>
                  </div>
                  <button
                    onClick={() => handleExportBoard(b)}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-sm transition"
                    title="Xuất nén tất cả mẫu biểu của Ban này"
                  >
                    <Download className="w-3.5 h-3.5" /> Xuất ZIP
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{b.description || 'Chưa có mô tả'}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> {boardAssignments.length} nhân sự
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" /> {boardTemplates.length} biểu mẫu
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
