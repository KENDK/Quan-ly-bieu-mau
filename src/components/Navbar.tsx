import React from 'react';
import { 
  FileText, 
  GraduationCap, 
  Users, 
  Award, 
  Layers, 
  Download, 
  RefreshCw,
  LayoutDashboard,
  FileCheck
} from 'lucide-react';
import type { Exam } from '../types/schema';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  exams: Exam[];
  activeExamId: string;
  onSelectExam: (examId: string) => void;
  onQuickBulkExport: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  exams,
  activeExamId,
  onSelectExam,
  onQuickBulkExport,
  onResetData
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'training', label: 'Loại Hình Đào Tạo', icon: GraduationCap },
    { id: 'personnel', label: 'Nhân Sự & Cán Bộ', icon: Users },
    { id: 'exams', label: 'Quản Lý Kỳ Thi', icon: Award },
    { id: 'boards', label: 'Cơ Cấu Ban & Phân Công', icon: Layers },
    { id: 'templates', label: 'Thư Viện Biểu Mẫu', icon: FileText },
    { id: 'generator', label: 'Tự Động Tạo & In Biểu Mẫu', icon: FileCheck },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              Hệ Thống Quản Lý Biểu Mẫu Kỳ Thi
            </h1>
            <p className="text-xs text-slate-400">Tự động hóa biên bản & phân công vai trò kỳ thi tốt nghiệp</p>
          </div>
        </div>

        {/* Right Controls: Active Exam Selector & Fast Bulk Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1.5 border border-slate-700">
            <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-400" /> Kỳ thi:
            </span>
            <select
              value={activeExamId}
              onChange={(e) => onSelectExam(e.target.value)}
              className="bg-slate-900 text-slate-100 text-xs font-medium rounded px-2.5 py-1 outline-none border border-slate-700 focus:border-indigo-500 transition cursor-pointer max-w-xs"
            >
              {exams.map(e => (
                <option key={e.id} value={e.id}>
                  {e.code} - {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Bulk Export All Button */}
          <button
            onClick={onQuickBulkExport}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs px-3 py-2 rounded-lg shadow-md transition transform active:scale-95"
            title="Xuất nén đồng loạt toàn bộ biểu mẫu các Ban của Kỳ thi này"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất 1-Click Tất Cả (ZIP)</span>
          </button>

          {/* Reset Data Button */}
          <button
            onClick={onResetData}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            title="Khôi phục dữ liệu mẫu ban đầu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Bar Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
