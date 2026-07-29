import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TrainingTypesView } from './components/TrainingTypesView';
import { GlobalSubjectsView } from './components/GlobalSubjectsView';
import { PersonnelView } from './components/PersonnelView';
import { ExamsView } from './components/ExamsView';
import { BoardsManagementView } from './components/BoardsManagementView';
import { TemplateEditorView } from './components/TemplateEditorView';
import { FormGeneratorView } from './components/FormGeneratorView';
import { StatisticsView } from './components/StatisticsView';
import { storage } from './services/storage';
import { exportAllExamFormsToZip } from './services/bulkExporter';
import type { TrainingType, GlobalSubject, Personnel, Exam, ExamBoard, FormTemplate } from './types/schema';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeExamId, setActiveExamId] = useState<string>(storage.getActiveExamId());
  const [isLoading, setIsLoading] = useState(true);

  // State collections
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [globalSubjects, setGlobalSubjects] = useState<GlobalSubject[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [boards, setBoards] = useState<ExamBoard[]>([]);
  const [allBoards, setAllBoards] = useState<ExamBoard[]>([]);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);

  // Load all data from storage
  const refreshAllData = () => {
    setTrainingTypes(storage.getTrainingTypes());
    setGlobalSubjects(storage.getGlobalSubjects());
    setPersonnel(storage.getPersonnel());
    const allExams = storage.getExams();
    setExams(allExams);

    const currentExamId = storage.getActiveExamId();
    setActiveExamId(currentExamId);

    setBoards(storage.getBoards(currentExamId));
    setAllBoards(storage.getBoards());
    setTemplates(storage.getTemplates());
  };

  useEffect(() => {
    const initializeAndLoad = async () => {
      setIsLoading(true);
      await storage.init();
      refreshAllData();
      setIsLoading(false);
    };
    initializeAndLoad();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      refreshAllData();
    }
  }, [activeExamId, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Đang đồng bộ hóa dữ liệu với máy chủ Django...</p>
        </div>
      </div>
    );
  }

  const handleSelectExam = (examId: string) => {
    storage.setActiveExamId(examId);
    setActiveExamId(examId);
  };

  const handleQuickBulkExport = async () => {
    const activeExam = exams.find(e => e.id === activeExamId);
    if (!activeExam) return;
    try {
      await exportAllExamFormsToZip(activeExam);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xuất file');
    }
  };

  const handleResetData = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu ban đầu?')) {
      storage.resetToDefaults();
      refreshAllData();
    }
  };

  // Handlers for Training Types
  const handleSaveTrainingType = (item: TrainingType) => {
    storage.saveTrainingType(item);
    refreshAllData();
  };
  const handleDeleteTrainingType = (id: string) => {
    storage.deleteTrainingType(id);
    refreshAllData();
  };

  // Handlers for Global Subjects
  const handleSaveGlobalSubject = (item: GlobalSubject) => {
    storage.saveGlobalSubject(item);
    refreshAllData();
  };
  const handleDeleteGlobalSubject = (id: string) => {
    storage.deleteGlobalSubject(id);
    refreshAllData();
  };

  // Handlers for Personnel
  const handleSavePersonnel = (item: Personnel) => {
    storage.savePersonnel(item);
    refreshAllData();
  };
  const handleDeletePersonnel = (id: string) => {
    storage.deletePersonnel(id);
    refreshAllData();
  };

  // Handlers for Exams
  const handleSaveExam = (item: Exam) => {
    storage.saveExam(item);
    refreshAllData();
  };
  const handleDeleteExam = (id: string) => {
    storage.deleteExam(id);
    refreshAllData();
  };

  // Handlers for Boards
  const handleSaveBoard = (item: ExamBoard) => {
    storage.saveBoard(item);
    refreshAllData();
  };
  const handleDeleteBoard = (id: string) => {
    storage.deleteBoard(id);
    refreshAllData();
  };

  // Handlers for Templates
  const handleSaveTemplate = (item: FormTemplate) => {
    storage.saveTemplate(item);
    refreshAllData();
  };
  const handleDeleteTemplate = (id: string) => {
    storage.deleteTemplate(id);
    refreshAllData();
  };

  const activeExam = exams.find(e => e.id === activeExamId) || exams[0];

  // Label for the top bar breadcrumb
  const PAGE_LABELS: Record<string, string> = {
    dashboard: 'Tổng Quan',
    exams: 'Quản Lý Kỳ Thi',
    boards: 'Cơ Cấu Ban & Phân Công',
    generator: 'Tạo & In Biểu Mẫu',
    statistics: 'Thống Kê & Báo Cáo',
    training: 'Cấu Hình › Loại Hình Đào Tạo',
    'global-subjects': 'Cấu Hình › Thư Viện Môn Thi',
    personnel: 'Cấu Hình › Nhân Sự & Cán Bộ',
    templates: 'Cấu Hình › Thư Viện Biểu Mẫu',
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased">
      {/* Sidebar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        exams={exams}
        activeExamId={activeExamId}
        onSelectExam={handleSelectExam}
        onQuickBulkExport={handleQuickBulkExport}
        onResetData={handleResetData}
      />

      {/* Main content — offset by sidebar width on lg+ */}
      <div className="lg:pl-64 flex flex-col min-h-screen">

        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-14">
            {/* Mobile: spacer for hamburger button */}
            <div className="w-8 lg:hidden" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {PAGE_LABELS[activeTab] ?? activeTab}
              </p>
              {activeExam && (activeTab === 'exams' || activeTab === 'boards' || activeTab === 'generator' || activeTab === 'dashboard') && (
                <p className="text-xs text-indigo-600 font-medium truncate">
                  {activeExam.code} — {activeExam.name}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              activeExam={activeExam}
              exams={exams}
              trainingTypes={trainingTypes}
              personnel={personnel}
              boards={boards}
              templates={templates}
              setActiveTab={setActiveTab}
              onSelectExam={handleSelectExam}
            />
          )}

          {activeTab === 'training' && (
            <TrainingTypesView
              trainingTypes={trainingTypes}
              onSave={handleSaveTrainingType}
              onDelete={handleDeleteTrainingType}
            />
          )}

          {activeTab === 'global-subjects' && (
            <GlobalSubjectsView
              subjects={globalSubjects}
              onSave={handleSaveGlobalSubject}
              onDelete={handleDeleteGlobalSubject}
            />
          )}

          {activeTab === 'personnel' && (
            <PersonnelView
              personnel={personnel}
              onSave={handleSavePersonnel}
              onDelete={handleDeletePersonnel}
            />
          )}

          {activeTab === 'exams' && (
            <ExamsView
              exams={exams}
              trainingTypes={trainingTypes}
              globalSubjects={globalSubjects}
              activeExamId={activeExamId}
              onSelectExam={handleSelectExam}
              onSave={handleSaveExam}
              onDelete={handleDeleteExam}
            />
          )}

          {activeTab === 'boards' && (
            <BoardsManagementView
              activeExam={activeExam}
              boards={boards}
              personnel={personnel}
              onSaveBoard={handleSaveBoard}
              onDeleteBoard={handleDeleteBoard}
              onRefreshData={refreshAllData}
            />
          )}

          {activeTab === 'templates' && (
            <TemplateEditorView
              templates={templates}
              onSave={handleSaveTemplate}
              onDelete={handleDeleteTemplate}
            />
          )}

          {activeTab === 'generator' && (
            <FormGeneratorView
              activeExam={activeExam}
              boards={boards}
              templates={templates}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsView
              exams={exams}
              trainingTypes={trainingTypes}
              personnel={personnel}
              allBoards={allBoards}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 text-slate-400 text-xs py-3 text-center bg-white/50">
          © 2026 Hệ Thống Quản Lý & Tự Động Tạo Biểu Mẫu Kỳ Thi Tốt Nghiệp.
        </footer>
      </div>
    </div>
  );
}

export default App;
