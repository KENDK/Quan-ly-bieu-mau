import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TrainingTypesView } from './components/TrainingTypesView';
import { PersonnelView } from './components/PersonnelView';
import { ExamsView } from './components/ExamsView';
import { BoardsManagementView } from './components/BoardsManagementView';
import { TemplateEditorView } from './components/TemplateEditorView';
import { FormGeneratorView } from './components/FormGeneratorView';
import { storage } from './services/storage';
import { exportAllExamFormsToZip } from './services/bulkExporter';
import type { TrainingType, Personnel, Exam, ExamBoard, FormTemplate } from './types/schema';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeExamId, setActiveExamId] = useState<string>(storage.getActiveExamId());

  // State collections
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [boards, setBoards] = useState<ExamBoard[]>([]);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);

  // Load all data from storage
  const refreshAllData = () => {
    setTrainingTypes(storage.getTrainingTypes());
    setPersonnel(storage.getPersonnel());
    const allExams = storage.getExams();
    setExams(allExams);

    const currentExamId = storage.getActiveExamId();
    setActiveExamId(currentExamId);

    setBoards(storage.getBoards(currentExamId));
    setTemplates(storage.getTemplates());
  };

  useEffect(() => {
    refreshAllData();
  }, [activeExamId]);

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

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col antialiased">
      {/* Header & Nav */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        exams={exams}
        activeExamId={activeExamId}
        onSelectExam={handleSelectExam}
        onQuickBulkExport={handleQuickBulkExport}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Hệ Thống Quản Lý & Tự Động Tạo Biểu Mẫu Kỳ Thi Tốt Nghiệp.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
