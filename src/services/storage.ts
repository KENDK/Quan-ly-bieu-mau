import type { TrainingType, Personnel, Exam, ExamBoard, BoardMemberAssignment, FormTemplate } from '../types/schema';
import { 
  INITIAL_TRAINING_TYPES, 
  INITIAL_PERSONNEL, 
  INITIAL_EXAMS, 
  INITIAL_BOARDS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_TEMPLATES 
} from './initialData';

const BASE_URL = '/api';

class StorageService {
  private trainingTypes: TrainingType[] = [];
  private personnel: Personnel[] = [];
  private exams: Exam[] = [];
  private boards: ExamBoard[] = [];
  private assignments: BoardMemberAssignment[] = [];
  private templates: FormTemplate[] = [];
  private activeExamId: string = '';
  
  public initialized: boolean = false;

  constructor() {
    // Load from local storage as local fallback before server load
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    this.trainingTypes = JSON.parse(localStorage.getItem('qlbm_training_types') || '[]');
    this.personnel = JSON.parse(localStorage.getItem('qlbm_personnel') || '[]');
    this.exams = JSON.parse(localStorage.getItem('qlbm_exams') || '[]');
    this.boards = JSON.parse(localStorage.getItem('qlbm_boards') || '[]');
    this.assignments = JSON.parse(localStorage.getItem('qlbm_assignments') || '[]');
    this.templates = JSON.parse(localStorage.getItem('qlbm_templates') || '[]');
    this.activeExamId = localStorage.getItem('qlbm_active_exam_id') || '';
  }

  private saveToLocalStorage() {
    localStorage.setItem('qlbm_training_types', JSON.stringify(this.trainingTypes));
    localStorage.setItem('qlbm_personnel', JSON.stringify(this.personnel));
    localStorage.setItem('qlbm_exams', JSON.stringify(this.exams));
    localStorage.setItem('qlbm_boards', JSON.stringify(this.boards));
    localStorage.setItem('qlbm_assignments', JSON.stringify(this.assignments));
    localStorage.setItem('qlbm_templates', JSON.stringify(this.templates));
    localStorage.setItem('qlbm_active_exam_id', this.activeExamId);
  }

  // Load and seed from server
  async init(): Promise<void> {
    try {
      // 1. Fetch Training Types
      let tTypesRes = await fetch(`${BASE_URL}/training-types/`);
      let tTypes: TrainingType[] = await tTypesRes.json();
      
      // If server database is empty, seed it
      if (tTypes.length === 0) {
        const hasLocalData = this.trainingTypes.length > 0 || this.personnel.length > 0 || this.exams.length > 0;
        
        if (hasLocalData) {
          console.log('Migrating existing LocalStorage data to Django/PostgreSQL backend...');
          
          // Seed Training Types from local storage
          for (const item of this.trainingTypes) {
            await fetch(`${BASE_URL}/training-types/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
          }
          tTypesRes = await fetch(`${BASE_URL}/training-types/`);
          tTypes = await tTypesRes.json();

          // Seed Personnel from local storage
          for (const item of this.personnel) {
            await fetch(`${BASE_URL}/personnel/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
          }

          // Seed Exams from local storage
          for (const item of this.exams) {
            await fetch(`${BASE_URL}/exams/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...item,
                training_type: item.trainingTypeId
              })
            });
          }

          // Seed Boards from local storage
          for (const item of this.boards) {
            await fetch(`${BASE_URL}/boards/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...item,
                exam: item.examId
              })
            });
          }

          // Seed Assignments from local storage
          for (const item of this.assignments) {
            await fetch(`${BASE_URL}/assignments/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...item,
                exam_board: item.examBoardId,
                personnel: item.personnelId
              })
            });
          }

          // Seed Templates from local storage
          for (const item of this.templates) {
            await fetch(`${BASE_URL}/templates/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
          }
        } else {
          console.log('Seeding initial defaults to Django/PostgreSQL backend...');
          
          // Seed Training Types
          for (const item of INITIAL_TRAINING_TYPES) {
            await fetch(`${BASE_URL}/training-types/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
          }
          tTypesRes = await fetch(`${BASE_URL}/training-types/`);
          tTypes = await tTypesRes.json();

          // Seed Personnel
          for (const item of INITIAL_PERSONNEL) {
            await fetch(`${BASE_URL}/personnel/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
          }

          // Seed Exams
          for (const item of INITIAL_EXAMS) {
            await fetch(`${BASE_URL}/exams/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...item,
                training_type: item.trainingTypeId
              })
            });
          }

          // Seed Boards
          for (const item of INITIAL_BOARDS) {
            await fetch(`${BASE_URL}/boards/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...item,
                exam: item.examId
              })
            });
          }

          // Seed Assignments
          for (const item of INITIAL_ASSIGNMENTS) {
            await fetch(`${BASE_URL}/assignments/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...item,
                exam_board: item.examBoardId,
                personnel: item.personnelId
              })
            });
          }

          // Seed Templates
          for (const item of INITIAL_TEMPLATES) {
            await fetch(`${BASE_URL}/templates/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
          }
        }
      }

      // Fetch all other data
      const [personnelRes, examsRes, boardsRes, assignmentsRes, templatesRes] = await Promise.all([
        fetch(`${BASE_URL}/personnel/`),
        fetch(`${BASE_URL}/exams/`),
        fetch(`${BASE_URL}/boards/`),
        fetch(`${BASE_URL}/assignments/`),
        fetch(`${BASE_URL}/templates/`)
      ]);

      this.trainingTypes = tTypes;
      this.personnel = await personnelRes.json();
      
      const examsRaw = await examsRes.json();
      this.exams = examsRaw.map((e: any) => ({
        ...e,
        trainingTypeId: e.training_type // map back foreign key relation
      }));

      const boardsRaw = await boardsRes.json();
      this.boards = boardsRaw.map((b: any) => ({
        ...b,
        examId: b.exam
      }));

      const assignmentsRaw = await assignmentsRes.json();
      this.assignments = assignmentsRaw.map((a: any) => ({
        ...a,
        examBoardId: a.exam_board,
        personnelId: a.personnel
      }));

      this.templates = await templatesRes.json();

      if (this.exams.length > 0 && !this.activeExamId) {
        this.activeExamId = this.exams[0].id;
      }

      this.saveToLocalStorage();
      this.initialized = true;
      console.log('Django API backend data synchronization completed successfully.');
    } catch (err) {
      console.error('Failed to sync with API backend, falling back to LocalStorage:', err);
    }
  }

  // Active Exam
  getActiveExamId(): string {
    return this.activeExamId || INITIAL_EXAMS[0].id;
  }

  setActiveExamId(id: string): void {
    this.activeExamId = id;
    this.saveToLocalStorage();
  }

  // Training Types
  getTrainingTypes(): TrainingType[] {
    return this.trainingTypes;
  }

  saveTrainingType(item: TrainingType): void {
    const list = this.trainingTypes;
    const index = list.findIndex(x => x.id === item.id);
    const isNew = index < 0;
    if (!isNew) {
      list[index] = item;
    } else {
      list.push(item);
    }
    this.saveToLocalStorage();

    // Async sync with server
    fetch(`${BASE_URL}/training-types/${isNew ? '' : item.id + '/'}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(err => console.error('API sync error:', err));
  }

  deleteTrainingType(id: string): void {
    this.trainingTypes = this.trainingTypes.filter(x => x.id !== id);
    this.saveToLocalStorage();

    // Async sync with server
    fetch(`${BASE_URL}/training-types/${id}/`, {
      method: 'DELETE'
    }).catch(err => console.error('API sync error:', err));
  }

  // Personnel
  getPersonnel(): Personnel[] {
    return this.personnel;
  }

  savePersonnel(item: Personnel): void {
    const list = this.personnel;
    const index = list.findIndex(x => x.id === item.id);
    const isNew = index < 0;
    if (!isNew) {
      list[index] = item;
    } else {
      list.push(item);
    }
    this.saveToLocalStorage();

    fetch(`${BASE_URL}/personnel/${isNew ? '' : item.id + '/'}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(err => console.error('API sync error:', err));
  }

  deletePersonnel(id: string): void {
    this.personnel = this.personnel.filter(x => x.id !== id);
    this.saveToLocalStorage();

    fetch(`${BASE_URL}/personnel/${id}/`, {
      method: 'DELETE'
    }).catch(err => console.error('API sync error:', err));
  }

  // Exams
  getExams(): Exam[] {
    return this.exams;
  }

  getExamById(id: string): Exam | undefined {
    return this.exams.find(x => x.id === id);
  }

  saveExam(item: Exam): void {
    const list = this.exams;
    const index = list.findIndex(x => x.id === item.id);
    const isNew = index < 0;
    if (!isNew) {
      list[index] = item;
    } else {
      list.push(item);
    }
    this.saveToLocalStorage();

    const payload = {
      ...item,
      training_type: item.trainingTypeId
    };

    fetch(`${BASE_URL}/exams/${isNew ? '' : item.id + '/'}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('API sync error:', err));
  }

  deleteExam(id: string): void {
    this.exams = this.exams.filter(x => x.id !== id);
    this.saveToLocalStorage();

    fetch(`${BASE_URL}/exams/${id}/`, {
      method: 'DELETE'
    }).catch(err => console.error('API sync error:', err));
  }

  // Exam Boards
  getBoards(examId?: string): ExamBoard[] {
    if (examId) {
      return this.boards.filter(x => x.examId === examId);
    }
    return this.boards;
  }

  saveBoard(item: ExamBoard): void {
    const list = this.boards;
    const index = list.findIndex(x => x.id === item.id);
    const isNew = index < 0;
    if (!isNew) {
      list[index] = item;
    } else {
      list.push(item);
    }
    this.saveToLocalStorage();

    const payload = {
      ...item,
      exam: item.examId
    };

    fetch(`${BASE_URL}/boards/${isNew ? '' : item.id + '/'}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('API sync error:', err));
  }

  deleteBoard(id: string): void {
    this.boards = this.boards.filter(x => x.id !== id);
    this.saveToLocalStorage();

    fetch(`${BASE_URL}/boards/${id}/`, {
      method: 'DELETE'
    }).catch(err => console.error('API sync error:', err));
  }

  // Assignments
  getAssignments(boardId?: string): BoardMemberAssignment[] {
    if (boardId) {
      return this.assignments.filter(x => x.examBoardId === boardId);
    }
    return this.assignments;
  }

  saveAssignment(item: BoardMemberAssignment): void {
    const list = this.assignments;
    const index = list.findIndex(x => x.id === item.id);
    const isNew = index < 0;
    if (!isNew) {
      list[index] = item;
    } else {
      list.push(item);
    }
    this.saveToLocalStorage();

    const payload = {
      ...item,
      exam_board: item.examBoardId,
      personnel: item.personnelId
    };

    fetch(`${BASE_URL}/assignments/${isNew ? '' : item.id + '/'}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('API sync error:', err));
  }

  deleteAssignment(id: string): void {
    this.assignments = this.assignments.filter(x => x.id !== id);
    this.saveToLocalStorage();

    fetch(`${BASE_URL}/assignments/${id}/`, {
      method: 'DELETE'
    }).catch(err => console.error('API sync error:', err));
  }

  // Templates
  getTemplates(boardCode?: string): FormTemplate[] {
    if (boardCode && boardCode !== 'ALL') {
      return this.templates.filter(x => x.boardCode === boardCode || x.boardCode === 'GENERAL');
    }
    return this.templates;
  }

  saveTemplate(item: FormTemplate): void {
    const list = this.templates;
    const index = list.findIndex(x => x.id === item.id);
    const isNew = index < 0;
    if (!isNew) {
      list[index] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.saveToLocalStorage();

    fetch(`${BASE_URL}/templates/${isNew ? '' : item.id + '/'}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(err => console.error('API sync error:', err));
  }

  deleteTemplate(id: string): void {
    this.templates = this.templates.filter(x => x.id !== id);
    this.saveToLocalStorage();

    fetch(`${BASE_URL}/templates/${id}/`, {
      method: 'DELETE'
    }).catch(err => console.error('API sync error:', err));
  }

  resetToDefaults(): void {
    localStorage.clear();
    this.loadFromLocalStorage();
    
    // Non-blocking trigger clear and seed
    fetch(`${BASE_URL}/training-types/`).then(async res => {
      try {
        const items: any[] = await res.json();
        for (const item of items) {
          await fetch(`${BASE_URL}/training-types/${item.id}/`, { method: 'DELETE' });
        }
      } catch (e) {}
      this.init();
    });
  }
}

export const storage = new StorageService();
