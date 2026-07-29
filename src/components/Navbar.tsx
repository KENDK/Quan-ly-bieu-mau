import React, { useState } from 'react';
import {
  FileText,
  GraduationCap,
  Users,
  Award,
  Layers,
  Download,
  RefreshCw,
  LayoutDashboard,
  FileCheck,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  BookOpen,
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

// ─── Sidebar nav structure ───────────────────────────────────────────────────

const MAIN_NAV = [
  { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
  { id: 'statistics', label: 'Thống Kê & Báo Cáo', icon: BarChart3 },
];

// Nhóm "Quản lý kỳ thi" — workflow items
const EXAM_NAV = [
  { id: 'exams', label: 'Danh Sách Kỳ Thi', icon: Award },
  { id: 'boards', label: 'Cơ Cấu Ban & Phân Công', icon: Layers },
  { id: 'generator', label: 'Tạo & In Biểu Mẫu', icon: FileCheck },
];

// Nhóm "Cấu hình" — collapsible
const CONFIG_NAV = [
  { id: 'training', label: 'Loại Hình Đào Tạo', icon: GraduationCap },
  { id: 'global-subjects', label: 'Thư Viện Môn Thi', icon: BookOpen },
  { id: 'personnel', label: 'Nhân Sự & Cán Bộ', icon: Users },
  { id: 'templates', label: 'Thư Viện Biểu Mẫu', icon: FileText },
];

const CONFIG_IDS = CONFIG_NAV.map((n) => n.id);

// ─── Nav button ───────────────────────────────────────────────────────────────

const NavBtn: React.FC<{
  item: { id: string; label: string; icon: React.FC<{ className?: string }> };
  isActive: boolean;
  onClick: () => void;
  indent?: boolean;
}> = ({ item, isActive, onClick, indent }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${indent ? 'pl-9' : ''
        } ${isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
          }`}
      />
      <span className="truncate leading-tight">{item.label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
      )}
    </button>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  exams,
  activeExamId,
  onSelectExam,
  onQuickBulkExport,
  onResetData,
}) => {
  const [configOpen, setConfigOpen] = useState(() => CONFIG_IDS.includes(activeTab));
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeExam = exams.find((e) => e.id === activeExamId);

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
    if (CONFIG_IDS.includes(id)) setConfigOpen(true);
  };

  const isExamGroupActive = EXAM_NAV.some((n) => n.id === activeTab);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Brand ─────────────────────────────────────────── */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-900/40 flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight text-white truncate">
              Quản Lý Biểu Mẫu
            </p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate">
              Kỳ Thi Tốt Nghiệp
            </p>
          </div>
        </div>
      </div>

      {/* ── Exam Selector ─────────────────────────────────── */}
      <div className="px-3 py-3 border-b border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-1 mb-1.5">
          Kỳ Thi Đang Chọn
        </p>
        <select
          value={activeExamId}
          onChange={(e) => onSelectExam(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500 transition cursor-pointer"
        >
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.code}
            </option>
          ))}
        </select>
        {activeExam && (
          <p className="text-[10px] text-slate-500 mt-1.5 px-1 leading-relaxed line-clamp-2">
            {activeExam.name}
          </p>
        )}
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
        {/* Main items */}
        {MAIN_NAV.map((item) => (
          <NavBtn
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            onClick={() => handleNav(item.id)}
          />
        ))}

        {/* Divider: Quản lý kỳ thi */}
        <div className="pt-3 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-1">
            Quản Lý Kỳ Thi
          </p>
        </div>

        {/* Exam workflow group */}
        <div
          className={`rounded-xl transition-all duration-200 ${isExamGroupActive
              ? 'bg-indigo-950/60 border border-indigo-900/50'
              : 'border border-transparent'
            } p-1 space-y-0.5`}
        >
          {EXAM_NAV.map((item) => (
            <NavBtn
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => handleNav(item.id)}
            />
          ))}
        </div>

        {/* Divider: Cấu hình */}
        <div className="pt-3 pb-1">
          <button
            onClick={() => setConfigOpen((o) => !o)}
            className="w-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-400 px-1 transition-colors"
          >
            <Settings className="w-3 h-3" />
            Cấu Hình
            {configOpen ? (
              <ChevronDown className="w-3 h-3 ml-auto" />
            ) : (
              <ChevronRight className="w-3 h-3 ml-auto" />
            )}
          </button>
        </div>

        {/* Config group — collapsible */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out space-y-0.5 ${configOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          {CONFIG_NAV.map((item) => (
            <NavBtn
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => handleNav(item.id)}
              indent
            />
          ))}
        </div>
      </nav>

      {/* ── Bottom Actions ────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-slate-800 space-y-2">
        <button
          onClick={onQuickBulkExport}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-emerald-900/40 transition transform active:scale-95"
          title="Xuất nén toàn bộ biểu mẫu kỳ thi đang chọn"
        >
          <Download className="w-4 h-4" />
          Xuất 1-Click Tất Cả (ZIP)
        </button>

        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 text-xs font-medium py-2 rounded-xl transition"
          title="Khôi phục dữ liệu mẫu ban đầu"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Khôi Phục Dữ Liệu Mẫu
        </button>

        <p className="text-center text-[10px] text-slate-700 pt-1">
          © 2026 Hệ Thống Quản Lý KT
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar (fixed) ──────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40 shadow-xl shadow-slate-950/50">
        {sidebarContent}
      </aside>

      {/* ── Mobile: Hamburger button ─────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-slate-900 rounded-xl shadow-lg text-white border border-slate-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile: Drawer overlay ───────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* drawer */}
          <aside className="relative z-10 flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
