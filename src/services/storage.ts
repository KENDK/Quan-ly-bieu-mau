import type { TrainingType, Personnel, Exam, ExamBoard, BoardMemberAssignment, FormTemplate } from '../types/schema';
import { 
  INITIAL_TRAINING_TYPES, 
  INITIAL_PERSONNEL, 
  INITIAL_EXAMS, 
  INITIAL_BOARDS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_TEMPLATES 
} from './initialData';

const KEYS = {
  TRAINING_TYPES: 'qlbm_training_types',
  PERSONNEL: 'qlbm_personnel',
  EXAMS: 'qlbm_exams',
  BOARDS: 'qlbm_boards',
  ASSIGNMENTS: 'qlbm_assignments',
  TEMPLATES: 'qlbm_templates',
  ACTIVE_EXAM_ID: 'qlbm_active_exam_id'
};

class StorageService {
  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    if (!localStorage.getItem(KEYS.TRAINING_TYPES)) {
      localStorage.setItem(KEYS.TRAINING_TYPES, JSON.stringify(INITIAL_TRAINING_TYPES));
    }
    if (!localStorage.getItem(KEYS.PERSONNEL)) {
      localStorage.setItem(KEYS.PERSONNEL, JSON.stringify(INITIAL_PERSONNEL));
    }
    if (!localStorage.getItem(KEYS.EXAMS)) {
      localStorage.setItem(KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
    }
    if (!localStorage.getItem(KEYS.BOARDS)) {
      localStorage.setItem(KEYS.BOARDS, JSON.stringify(INITIAL_BOARDS));
    }
    if (!localStorage.getItem(KEYS.ASSIGNMENTS)) {
      localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
    }
    if (!localStorage.getItem(KEYS.TEMPLATES)) {
      localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
    }
    if (!localStorage.getItem(KEYS.ACTIVE_EXAM_ID)) {
      localStorage.setItem(KEYS.ACTIVE_EXAM_ID, INITIAL_EXAMS[0].id);
    }
  }

  // Active Exam
  getActiveExamId(): string {
    return localStorage.getItem(KEYS.ACTIVE_EXAM_ID) || INITIAL_EXAMS[0].id;
  }

  setActiveExamId(id: string): void {
    localStorage.setItem(KEYS.ACTIVE_EXAM_ID, id);
  }

  // Training Types
  getTrainingTypes(): TrainingType[] {
    return JSON.parse(localStorage.getItem(KEYS.TRAINING_TYPES) || '[]');
  }

  saveTrainingType(item: TrainingType): void {
    const list = this.getTrainingTypes();
    const index = list.findIndex(x => x.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem(KEYS.TRAINING_TYPES, JSON.stringify(list));
  }

  deleteTrainingType(id: string): void {
    const list = this.getTrainingTypes().filter(x => x.id !== id);
    localStorage.setItem(KEYS.TRAINING_TYPES, JSON.stringify(list));
  }

  // Personnel
  getPersonnel(): Personnel[] {
    return JSON.parse(localStorage.getItem(KEYS.PERSONNEL) || '[]');
  }

  savePersonnel(item: Personnel): void {
    const list = this.getPersonnel();
    const index = list.findIndex(x => x.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem(KEYS.PERSONNEL, JSON.stringify(list));
  }

  deletePersonnel(id: string): void {
    const list = this.getPersonnel().filter(x => x.id !== id);
    localStorage.setItem(KEYS.PERSONNEL, JSON.stringify(list));
  }

  // Exams
  getExams(): Exam[] {
    return JSON.parse(localStorage.getItem(KEYS.EXAMS) || '[]');
  }

  getExamById(id: string): Exam | undefined {
    return this.getExams().find(x => x.id === id);
  }

  saveExam(item: Exam): void {
    const list = this.getExams();
    const index = list.findIndex(x => x.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(list));
  }

  deleteExam(id: string): void {
    const list = this.getExams().filter(x => x.id !== id);
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(list));
  }

  // Exam Boards
  getBoards(examId?: string): ExamBoard[] {
    const list: ExamBoard[] = JSON.parse(localStorage.getItem(KEYS.BOARDS) || '[]');
    if (examId) {
      return list.filter(x => x.examId === examId);
    }
    return list;
  }

  saveBoard(item: ExamBoard): void {
    const list = JSON.parse(localStorage.getItem(KEYS.BOARDS) || '[]') as ExamBoard[];
    const index = list.findIndex(x => x.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem(KEYS.BOARDS, JSON.stringify(list));
  }

  deleteBoard(id: string): void {
    const list = JSON.parse(localStorage.getItem(KEYS.BOARDS) || '[]') as ExamBoard[];
    const filtered = list.filter(x => x.id !== id);
    localStorage.setItem(KEYS.BOARDS, JSON.stringify(filtered));
  }

  // Assignments
  getAssignments(boardId?: string): BoardMemberAssignment[] {
    const list: BoardMemberAssignment[] = JSON.parse(localStorage.getItem(KEYS.ASSIGNMENTS) || '[]');
    if (boardId) {
      return list.filter(x => x.examBoardId === boardId);
    }
    return list;
  }

  saveAssignment(item: BoardMemberAssignment): void {
    const list = JSON.parse(localStorage.getItem(KEYS.ASSIGNMENTS) || '[]') as BoardMemberAssignment[];
    const index = list.findIndex(x => x.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(list));
  }

  deleteAssignment(id: string): void {
    const list = JSON.parse(localStorage.getItem(KEYS.ASSIGNMENTS) || '[]') as BoardMemberAssignment[];
    const filtered = list.filter(x => x.id !== id);
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(filtered));
  }

  // Templates
  getTemplates(boardCode?: string): FormTemplate[] {
    const list: FormTemplate[] = JSON.parse(localStorage.getItem(KEYS.TEMPLATES) || '[]');
    if (boardCode && boardCode !== 'ALL') {
      return list.filter(x => x.boardCode === boardCode || x.boardCode === 'GENERAL');
    }
    return list;
  }

  saveTemplate(item: FormTemplate): void {
    const list = JSON.parse(localStorage.getItem(KEYS.TEMPLATES) || '[]') as FormTemplate[];
    const index = list.findIndex(x => x.id === item.id);
    if (index >= 0) {
      list[index] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(list));
  }

  deleteTemplate(id: string): void {
    const list = JSON.parse(localStorage.getItem(KEYS.TEMPLATES) || '[]') as FormTemplate[];
    const filtered = list.filter(x => x.id !== id);
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(filtered));
  }

  // Reset to initial defaults
  resetToDefaults(): void {
    localStorage.setItem(KEYS.TRAINING_TYPES, JSON.stringify(INITIAL_TRAINING_TYPES));
    localStorage.setItem(KEYS.PERSONNEL, JSON.stringify(INITIAL_PERSONNEL));
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
    localStorage.setItem(KEYS.BOARDS, JSON.stringify(INITIAL_BOARDS));
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
    localStorage.setItem(KEYS.ACTIVE_EXAM_ID, INITIAL_EXAMS[0].id);
  }
}

export const storage = new StorageService();
