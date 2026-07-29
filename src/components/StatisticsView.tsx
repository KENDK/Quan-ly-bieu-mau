import React, { useState, useMemo } from 'react';
import {
  BarChart3, Users, Calendar, FileSpreadsheet,
  Award, BookOpen,
  Filter, ChevronUp, ChevronDown, Search, GraduationCap,
  ClipboardList, Layers
} from 'lucide-react';
import type { Exam, TrainingType, Personnel, ExamBoard, BoardMemberAssignment } from '../types/schema';
import {
  exportFullReportToExcel,
  exportExamSummaryExcel,
  exportPersonnelExcel,
  exportTimelineExcel,
  type ExportParams,
} from '../services/excelExporter';
import { storage } from '../services/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatisticsViewProps {
  exams: Exam[];
  trainingTypes: TrainingType[];
  personnel: Personnel[];
  allBoards: ExamBoard[];
}

type SortDir = 'asc' | 'desc';

const STATUS_LABEL: Record<string, string> = {
  planning: 'Lên kế hoạch',
  ongoing: 'Đang diễn ra',
  completed: 'Hoàn thành',
};

const STATUS_COLOR: Record<string, string> = {
  planning: 'bg-amber-100 text-amber-700 border-amber-200',
  ongoing: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

function fmtDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }> = ({
  icon, label, value, sub, color,
}) => (
  <div className={`rounded-2xl p-5 border flex items-center gap-4 shadow-sm ${color}`}>
    <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0 shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-extrabold leading-tight">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Tab 1: Kỳ Thi ───────────────────────────────────────────────────────────

const ExamStatsTab: React.FC<{
  exams: Exam[];
  trainingTypes: TrainingType[];
  allBoards: ExamBoard[];
  allAssignments: BoardMemberAssignment[];
  personnel: Personnel[];
  onExport: () => void;
}> = ({ exams, trainingTypes, allBoards, allAssignments, personnel, onExport }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortCol, setSortCol] = useState<string>('examDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return exams
      .filter((e) => {
        const q = search.toLowerCase();
        const matchSearch = !q || e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q);
        const matchStatus = filterStatus === 'all' || e.status === filterStatus;
        const matchType = filterType === 'all' || e.trainingTypeId === filterType;
        return matchSearch && matchStatus && matchType;
      })
      .map((exam) => {
        const tt = trainingTypes.find((t) => t.id === exam.trainingTypeId);
        const boards = allBoards.filter((b) => b.examId === exam.id);
        const boardIds = boards.map((b) => b.id);
        const assignments = allAssignments.filter((a) => boardIds.includes(a.examBoardId));
        const uniquePersonnel = new Set(assignments.map((a) => a.personnelId)).size;
        return { exam, tt, boardCount: boards.length, personnelCount: uniquePersonnel };
      })
      .sort((a, b) => {
        let va: string | number = '';
        let vb: string | number = '';
        if (sortCol === 'examDate') { va = a.exam.examDate; vb = b.exam.examDate; }
        else if (sortCol === 'name') { va = a.exam.name; vb = b.exam.name; }
        else if (sortCol === 'boards') { va = a.boardCount; vb = b.boardCount; }
        else if (sortCol === 'personnel') { va = a.personnelCount; vb = b.personnelCount; }
        else if (sortCol === 'subjects') { va = a.exam.totalSubjects; vb = b.exam.totalSubjects; }
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [exams, trainingTypes, allBoards, allAssignments, search, filterStatus, filterType, sortCol, sortDir]);

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortIcon: React.FC<{ col: string }> = ({ col }) =>
    sortCol === col
      ? sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
      : <ChevronUp className="w-3.5 h-3.5 opacity-20" />;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center shadow-sm">
        <Filter className="w-4 h-4 text-slate-400" />
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm kỳ thi..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
          <option value="all">Tất cả trạng thái</option>
          <option value="planning">Lên kế hoạch</option>
          <option value="ongoing">Đang diễn ra</option>
          <option value="completed">Hoàn thành</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
          <option value="all">Tất cả loại hình</option>
          {trainingTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button onClick={onExport}
          className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition">
          <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 w-10">STT</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('name')}>
                <span className="flex items-center gap-1">Tên Kỳ Thi <SortIcon col="name" /></span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Loại Hình</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('examDate')}>
                <span className="flex items-center justify-center gap-1">Ngày Thi <SortIcon col="examDate" /></span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('subjects')}>
                <span className="flex items-center justify-center gap-1">Môn <SortIcon col="subjects" /></span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Phòng</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Tổng SV</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('boards')}>
                <span className="flex items-center justify-center gap-1">Số Ban <SortIcon col="boards" /></span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('personnel')}>
                <span className="flex items-center justify-center gap-1">Nhân Sự <SortIcon col="personnel" /></span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Trạng Thái</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 w-24">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr><td colSpan={11} className="text-center py-10 text-slate-400 text-sm">Không có dữ liệu phù hợp</td></tr>
            ) : rows.map(({ exam, tt, boardCount, personnelCount }, i) => (
              <React.Fragment key={exam.id}>
                <tr className="hover:bg-indigo-50/40 transition">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 leading-tight">{exam.name}</p>
                    <p className="text-xs text-indigo-600 font-mono mt-0.5">{exam.code}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{exam.cohort}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{tt?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-center text-xs font-medium text-slate-700">{fmtDate(exam.examDate)}</td>
                  <td className="px-4 py-3 text-center font-bold text-indigo-700">{exam.totalSubjects}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{exam.totalRooms}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{exam.totalRooms * exam.studentsPerRoom}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">{boardCount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-full">
                      <Users className="w-3 h-3" />{personnelCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[exam.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_LABEL[exam.status] ?? exam.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}
                      className={`inline-flex items-center gap-1 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition ${
                        expandedId === exam.id 
                          ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' 
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      {expandedId === exam.id ? 'Ẩn' : 'Xem'}
                    </button>
                  </td>
                </tr>
                {expandedId === exam.id && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={11} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
                        {/* Subjects section */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                          <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <BookOpen className="w-4 h-4 text-indigo-600" />
                            Danh Sách Môn Thi ({exam.subjectsList?.length || 0})
                          </h4>
                          {!exam.subjectsList || exam.subjectsList.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Chưa thiết lập môn thi</p>
                          ) : (
                            <div className="flex flex-wrap gap-2 pt-1 max-h-[250px] overflow-y-auto pr-1">
                              {exam.subjectsList.map((subject, idx) => (
                                <span key={idx} className="inline-block bg-slate-50 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-200 hover:bg-indigo-50 transition cursor-default">
                                  {subject}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Members section */}
                        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                          <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                            <Users className="w-4 h-4 text-indigo-600" />
                            Ban Chuyên Trách & Phân Công Vai Trò
                          </h4>
                          {(() => {
                            const boards = allBoards.filter(b => b.examId === exam.id);
                            if (boards.length === 0) {
                              return <p className="text-xs text-slate-400 italic">Kỳ thi chưa thiết lập các Ban chuyên trách</p>;
                            }

                            return (
                              <div className="space-y-3 divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                                {boards.map(board => {
                                  const boardAssignments = allAssignments.filter(a => a.examBoardId === board.id);
                                  return (
                                    <div key={board.id} className="pt-2.5 first:pt-0 space-y-1.5">
                                      <h5 className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                                        {board.boardName} ({board.boardCode})
                                      </h5>
                                      {boardAssignments.length === 0 ? (
                                        <p className="text-[11px] text-slate-400 italic pl-3">Chưa có nhân sự được phân công</p>
                                      ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3">
                                          {boardAssignments.map(asgn => {
                                            const p = personnel.find(x => x.id === asgn.personnelId);
                                            if (!p) return null;
                                            return (
                                              <div key={asgn.id} className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-xs flex flex-col justify-between hover:border-indigo-200 hover:bg-indigo-50/10 transition">
                                                <div>
                                                  <p className="font-bold text-slate-800">{p.fullName}</p>
                                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                                    {p.academicTitle ? `${p.academicTitle} ` : ''}{p.militaryRank ? `[${p.militaryRank}]` : ''} - {p.department} ({p.position || 'Cán bộ'})
                                                  </p>
                                                </div>
                                                <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                                                  <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded text-[10px] border border-indigo-100">
                                                    {asgn.roleName}
                                                  </span>
                                                  {asgn.assignedSubject && (
                                                    <span className="bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded text-[10px] border border-emerald-100 max-w-[120px] truncate" title={asgn.assignedSubject}>
                                                      {asgn.assignedSubject}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 text-right">Hiển thị {rows.length} / {exams.length} kỳ thi</p>
    </div>
  );
};

// ─── Tab 2: Nhân Sự ──────────────────────────────────────────────────────────

const PersonnelStatsTab: React.FC<{
  personnel: Personnel[];
  exams: Exam[];
  allBoards: ExamBoard[];
  allAssignments: BoardMemberAssignment[];
  onExport: () => void;
}> = ({ personnel, exams, allBoards, allAssignments, onExport }) => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [sortCol, setSortCol] = useState<string>('examCount');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const departments = useMemo(() => [...new Set(personnel.map((p) => p.department))].sort(), [personnel]);

  const rows = useMemo(() => {
    return personnel
      .filter((p) => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.fullName.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
        const matchDept = filterDept === 'all' || p.department === filterDept;
        return matchSearch && matchDept;
      })
      .map((p) => {
        const myAssignments = allAssignments.filter((a) => a.personnelId === p.id);
        const boardIds = [...new Set(myAssignments.map((a) => a.examBoardId))];
        const boards = allBoards.filter((b) => boardIds.includes(b.id));
        const examIds = [...new Set(boards.map((b) => b.examId))];
        const involvedExams = exams.filter((e) => examIds.includes(e.id));
        const roles = [...new Set(myAssignments.map((a) => a.roleName))];
        const boardNames = [...new Set(boards.map((b) => b.boardName))];
        return { p, myAssignments, involvedExams, roles, boardNames, boardCount: boards.length };
      })
      .sort((a, b) => {
        let va: string | number = '';
        let vb: string | number = '';
        if (sortCol === 'name') { va = a.p.fullName; vb = b.p.fullName; }
        else if (sortCol === 'examCount') { va = a.involvedExams.length; vb = b.involvedExams.length; }
        else if (sortCol === 'boardCount') { va = a.boardCount; vb = b.boardCount; }
        else if (sortCol === 'dept') { va = a.p.department; vb = b.p.department; }
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [personnel, exams, allBoards, allAssignments, search, filterDept, sortCol, sortDir]);

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortIcon: React.FC<{ col: string }> = ({ col }) =>
    sortCol === col
      ? sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
      : <ChevronUp className="w-3.5 h-3.5 opacity-20" />;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center shadow-sm">
        <Filter className="w-4 h-4 text-slate-400" />
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nhân sự..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
          <option value="all">Tất cả đơn vị</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={onExport}
          className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition">
          <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 w-10">STT</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('name')}>
                <span className="flex items-center gap-1">Họ và Tên <SortIcon col="name" /></span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('dept')}>
                <span className="flex items-center gap-1">Đơn Vị <SortIcon col="dept" /></span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('examCount')}>
                <span className="flex items-center justify-center gap-1">Số KT Tham Gia <SortIcon col="examCount" /></span>
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer select-none" onClick={() => toggleSort('boardCount')}>
                <span className="flex items-center justify-center gap-1">Số Ban <SortIcon col="boardCount" /></span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Các Vai Trò</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">Không có dữ liệu phù hợp</td></tr>
            ) : rows.map(({ p, involvedExams, roles, boardNames, myAssignments }, i) => (
              <React.Fragment key={p.id}>
                <tr className={`hover:bg-indigo-50/40 transition ${expandedId === p.id ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{p.fullName}</p>
                    <p className="text-xs text-indigo-600 mt-0.5">{p.academicTitle ? `${p.academicTitle} · ` : ''}{p.position || 'Cán bộ'}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p.department}</td>
                  <td className="px-4 py-3 text-center">
                    {involvedExams.length > 0
                      ? <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-200">
                        <Award className="w-3 h-3" />{involvedExams.length}
                      </span>
                      : <span className="text-slate-300 text-xs">Chưa có</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-1 rounded-full">
                      <Layers className="w-3 h-3" />{boardNames.length}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {roles.slice(0, 3).map((r) => (
                        <span key={r} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-md border border-indigo-100 font-medium">{r}</span>
                      ))}
                      {roles.length > 3 && <span className="text-xs text-slate-400">+{roles.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2">
                      {expandedId === p.id ? 'Ẩn' : 'Xem'}
                    </button>
                  </td>
                </tr>
                {expandedId === p.id && (
                  <tr className="bg-indigo-50/20">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Chi tiết phân công của {p.fullName}:</p>
                        {myAssignments.length === 0
                          ? <p className="text-xs text-slate-400">Chưa có phân công nào.</p>
                          : <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {myAssignments.map((asgn) => {
                              const board = allBoards.find((b) => b.id === asgn.examBoardId);
                              const exam = board ? exams.find((e) => e.id === board.examId) : undefined;
                              return (
                                <div key={asgn.id} className="bg-white rounded-lg border border-indigo-100 px-3 py-2 text-xs space-y-1">
                                  <p className="font-semibold text-slate-700">{exam?.name ?? '—'}</p>
                                  <p className="text-slate-500">Ban: <span className="text-indigo-600 font-medium">{board?.boardName ?? '—'}</span></p>
                                  <p className="text-slate-500">Vai trò: <span className="text-slate-800 font-medium">{asgn.roleName}</span></p>
                                  {asgn.assignedSubject && <p className="text-slate-500">Phụ trách: <span className="text-slate-700">{asgn.assignedSubject}</span></p>}
                                  <p className="text-slate-400">Ngày thi: {exam ? fmtDate(exam.examDate) : '—'}</p>
                                </div>
                              );
                            })}
                          </div>
                        }
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 text-right">Hiển thị {rows.length} / {personnel.length} nhân sự</p>
    </div>
  );
};

// ─── Tab 3: Thời Gian ────────────────────────────────────────────────────────

const TimelineStatsTab: React.FC<{
  exams: Exam[];
  trainingTypes: TrainingType[];
  allBoards: ExamBoard[];
  allAssignments: BoardMemberAssignment[];
  onExport: () => void;
}> = ({ exams, trainingTypes, allBoards, allAssignments, onExport }) => {
  const [filterYear, setFilterYear] = useState('all');

  const years = useMemo(() => {
    const ys = exams.map((e) => new Date(e.examDate).getFullYear()).filter((y) => !isNaN(y));
    return [...new Set(ys)].sort((a, b) => a - b);
  }, [exams]);

  const rows = useMemo(() => {
    return [...exams]
      .filter((e) => {
        const y = new Date(e.examDate).getFullYear();
        return filterYear === 'all' || String(y) === filterYear;
      })
      .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
      .map((exam) => {
        const d = new Date(exam.examDate);
        const tt = trainingTypes.find((t) => t.id === exam.trainingTypeId);
        const boards = allBoards.filter((b) => b.examId === exam.id);
        const boardIds = boards.map((b) => b.id);
        const assignments = allAssignments.filter((a) => boardIds.includes(a.examBoardId));
        const uniquePersonnel = new Set(assignments.map((a) => a.personnelId)).size;
        return {
          exam, tt,
          year: isNaN(d.getTime()) ? '—' : d.getFullYear(),
          month: isNaN(d.getTime()) ? '—' : d.getMonth() + 1,
          boardCount: boards.length,
          personnelCount: uniquePersonnel,
        };
      });
  }, [exams, trainingTypes, allBoards, allAssignments, filterYear]);

  // Group by year for summary bar chart
  const byYear = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach(({ year }) => {
      const k = String(year);
      map[k] = (map[k] ?? 0) + 1;
    });
    return Object.entries(map).sort(([a], [b]) => Number(a) - Number(b));
  }, [rows]);

  const maxCount = Math.max(...byYear.map(([, v]) => v), 1);

  return (
    <div className="space-y-4">
      {/* Year bar mini-chart */}
      {byYear.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Phân Bổ Kỳ Thi Theo Năm</p>
          <div className="flex items-end gap-3 h-24">
            {byYear.map(([year, count]) => (
              <div key={year} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-xs font-bold text-indigo-700">{count}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-500"
                  style={{ height: `${(count / maxCount) * 72}px`, minHeight: 8 }}
                />
                <span className="text-xs text-slate-500 font-medium">{year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter + Export */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center shadow-sm">
        <Filter className="w-4 h-4 text-slate-400" />
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
          <option value="all">Tất cả năm</option>
          {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
        </select>
        <button onClick={onExport}
          className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition">
          <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
        </button>
      </div>

      {/* Timeline table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[780px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 w-16">Năm</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 w-16">Tháng</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Kỳ Thi</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Loại Hình</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Ngày Thi</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Số Ban</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Nhân Sự</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0
              ? <tr><td colSpan={8} className="text-center py-10 text-slate-400 text-sm">Không có kỳ thi nào</td></tr>
              : rows.map(({ exam, tt, year, month, boardCount, personnelCount }) => (
                <tr key={exam.id} className="hover:bg-indigo-50/40 transition">
                  <td className="px-4 py-3 text-center font-bold text-slate-700">{year}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block bg-indigo-600 text-white font-bold text-xs w-7 h-7 rounded-full leading-7 text-center">{month}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 leading-tight">{exam.name}</p>
                    <p className="text-xs font-mono text-indigo-600 mt-0.5">{exam.code} · {exam.cohort}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{exam.location}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{tt?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-center text-xs font-medium text-slate-700">{fmtDate(exam.examDate)}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">{boardCount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-full">
                      <Users className="w-3 h-3" />{personnelCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[exam.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_LABEL[exam.status] ?? exam.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 text-right">Hiển thị {rows.length} / {exams.length} kỳ thi</p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  exams, trainingTypes, personnel, allBoards,
}) => {
  const [activeTab, setActiveTab] = useState<'exams' | 'personnel' | 'timeline'>('exams');
  const [isExporting, setIsExporting] = useState(false);

  const allAssignments = useMemo(() => storage.getAssignments(), []);

  // Global KPIs
  const totalPersonnelInvolved = useMemo(() => {
    const allBoardIds = allBoards.map((b) => b.id);
    return new Set(allAssignments.filter((a) => allBoardIds.includes(a.examBoardId)).map((a) => a.personnelId)).size;
  }, [allBoards, allAssignments]);

  const thisYearExams = useMemo(() => {
    const y = new Date().getFullYear();
    return exams.filter((e) => new Date(e.examDate).getFullYear() === y).length;
  }, [exams]);

  const exportParams: ExportParams = { exams, trainingTypes, personnel, allBoards, allAssignments };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      exportFullReportToExcel(exportParams);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const tabs = [
    { id: 'exams' as const, label: 'Chi Tiết Kỳ Thi', icon: ClipboardList },
    { id: 'personnel' as const, label: 'Nhân Sự & Cán Bộ', icon: Users },
    { id: 'timeline' as const, label: 'Theo Thời Gian', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-violet-900/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-3">
              <BarChart3 className="w-3.5 h-3.5" /> Thống Kê & Báo Cáo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Thống Kê Toàn Diện Hệ Thống
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-xl">
              Xem thống kê chi tiết theo kỳ thi, nhân sự & cán bộ, thời gian — xuất báo cáo Excel đầy đủ.
            </p>
          </div>
          <button
            onClick={handleExportAll}
            disabled={isExporting}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            {isExporting
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang xuất...</>
              : <><FileSpreadsheet className="w-5 h-5" />Xuất Toàn Bộ Báo Cáo Excel</>
            }
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          icon={<Award className="w-6 h-6 text-amber-600" />}
          label="Tổng Kỳ Thi" value={exams.length}
          sub={`${thisYearExams} kỳ trong năm ${new Date().getFullYear()}`}
          color="bg-amber-50 border-amber-200 text-amber-900"
        />
        <KpiCard
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          label="Tổng Nhân Sự" value={personnel.length}
          sub={`${totalPersonnelInvolved} người đã được phân công`}
          color="bg-indigo-50 border-indigo-200 text-indigo-900"
        />
        <KpiCard
          icon={<Layers className="w-6 h-6 text-violet-600" />}
          label="Tổng Số Ban" value={allBoards.length}
          sub="Tính trên tất cả kỳ thi"
          color="bg-violet-50 border-violet-200 text-violet-900"
        />
        <KpiCard
          icon={<GraduationCap className="w-6 h-6 text-emerald-600" />}
          label="Loại Hình ĐT" value={trainingTypes.length}
          sub="Hệ đào tạo đang quản lý"
          color="bg-emerald-50 border-emerald-200 text-emerald-900"
        />
      </div>

      {/* Tab navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition border-b-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {activeTab === 'exams' && (
            <ExamStatsTab
              exams={exams} trainingTypes={trainingTypes}
              allBoards={allBoards} allAssignments={allAssignments}
              personnel={personnel}
              onExport={() => exportExamSummaryExcel(exportParams)}
            />
          )}
          {activeTab === 'personnel' && (
            <PersonnelStatsTab
              personnel={personnel} exams={exams}
              allBoards={allBoards} allAssignments={allAssignments}
              onExport={() => exportPersonnelExcel(exportParams)}
            />
          )}
          {activeTab === 'timeline' && (
            <TimelineStatsTab
              exams={exams} trainingTypes={trainingTypes}
              allBoards={allBoards} allAssignments={allAssignments}
              onExport={() => exportTimelineExcel(exportParams)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
