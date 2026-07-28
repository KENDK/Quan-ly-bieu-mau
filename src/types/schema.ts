export interface TrainingType {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Personnel {
  id: string;
  fullName: string;
  academicTitle: string; // TS., PGS.TS., ThS., CN.
  department: string; // Đơn vị / Khoa phòng
  position: string; // Chức vụ chính quyền
  phone?: string;
  email?: string;
  createdAt: string;
}

export interface ExamSubject {
  id: string;
  examId: string;
  subjectName: string;
  subjectCode?: string;
  orderIndex: number;
}

export interface Exam {
  id: string;
  code: string;
  name: string;
  trainingTypeId: string;
  cohort: string; // Khóa tốt nghiệp
  examDate: string; // Thời gian thi (YYYY-MM-DD)
  location: string; // Địa điểm tổ chức
  totalSubjects: number;
  totalRooms: number;
  studentsPerRoom: number;
  subjectsList: string[]; // Danh sách môn thi
  status: 'planning' | 'ongoing' | 'completed';
  createdAt: string;
}

export interface ExamBoard {
  id: string;
  examId: string;
  boardCode: string; // DE_THI, COI_THI, PHACH, CHAM_THI, GIAM_SAT
  boardName: string; // Ban Đề thi, Ban Coi thi...
  description?: string;
  createdAt: string;
}

export interface BoardMemberAssignment {
  id: string;
  examBoardId: string;
  personnelId: string;
  roleName: string; // Trưởng ban, Phó Trưởng ban, Trưởng môn thi, Phản biện, Thư ký, Cán bộ coi thi...
  assignedSubject?: string;
  notes?: string;
}

export interface FormTemplate {
  id: string;
  boardCode: string; // Thuộc Ban nào (DE_THI, COI_THI, PHACH, CHAM_THI, GIAM_SAT, GENERAL)
  templateCode: string;
  title: string;
  description?: string;
  htmlContent: string; // Chứa thẻ placeholder {{...}}
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  examId: string;
  boardId: string;
  title: string;
  renderedHtml: string;
  generatedAt: string;
}
