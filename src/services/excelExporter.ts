import * as XLSX from 'xlsx';
import type { Exam, TrainingType, Personnel, ExamBoard, BoardMemberAssignment } from '../types/schema';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  planning: 'Đang lên kế hoạch',
  ongoing: 'Đang diễn ra',
  completed: 'Đã hoàn thành',
};

function fmtDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function applyHeaderStyle(ws: XLSX.WorkSheet, range: XLSX.Range) {
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: range.s.r, c: C });
    if (!ws[addr]) continue;
    ws[addr].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
      fill: { fgColor: { rgb: '3730A3' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thin', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
        left: { style: 'thin', color: { rgb: 'CCCCCC' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } },
      },
    };
  }
}

function setColWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ws['!cols'] = widths.map((w) => ({ wch: w }));
}

// ─── Sheet 1: Tổng Hợp Kỳ Thi ───────────────────────────────────────────────

function buildExamSummarySheet(
  exams: Exam[],
  trainingTypes: TrainingType[],
  allBoards: ExamBoard[],
  allAssignments: BoardMemberAssignment[]
): XLSX.WorkSheet {
  const headers = [
    'STT',
    'Mã Kỳ Thi',
    'Tên Kỳ Thi',
    'Loại Hình Đào Tạo',
    'Khóa Tốt Nghiệp',
    'Ngày Thi',
    'Địa Điểm',
    'Số Môn Thi',
    'Số Phòng Thi',
    'SV / Phòng',
    'Tổng SV Dự Thi',
    'Số Ban',
    'Tổng Nhân Sự Tham Gia',
    'Trạng Thái',
    'Ngày Tạo',
  ];

  const rows = exams.map((exam, i) => {
    const tt = trainingTypes.find((t) => t.id === exam.trainingTypeId);
    const boards = allBoards.filter((b) => b.examId === exam.id);
    const boardIds = boards.map((b) => b.id);
    const assignments = allAssignments.filter((a) => boardIds.includes(a.examBoardId));
    const uniquePersonnel = new Set(assignments.map((a) => a.personnelId));

    return [
      i + 1,
      exam.code,
      exam.name,
      tt?.name ?? 'Chưa rõ',
      exam.cohort,
      fmtDate(exam.examDate),
      exam.location,
      exam.totalSubjects,
      exam.totalRooms,
      exam.studentsPerRoom,
      exam.totalRooms * exam.studentsPerRoom,
      boards.length,
      uniquePersonnel.size,
      STATUS_LABEL[exam.status] ?? exam.status,
      fmtDate(exam.createdAt),
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  applyHeaderStyle(ws, { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } });
  setColWidths(ws, [5, 18, 50, 28, 22, 12, 30, 10, 12, 10, 14, 8, 18, 22, 14]);
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  return ws;
}

// ─── Sheet 2: Chi Tiết Nhân Sự ───────────────────────────────────────────────

function buildPersonnelDetailSheet(
  personnel: Personnel[],
  exams: Exam[],
  allBoards: ExamBoard[],
  allAssignments: BoardMemberAssignment[],
  trainingTypes: TrainingType[]
): XLSX.WorkSheet {
  const headers = [
    'STT',
    'Họ và Tên',
    'Học Hàm / Học Vị',
    'Đơn Vị / Khoa Phòng',
    'Chức Vụ',
    'Mã Kỳ Thi',
    'Tên Kỳ Thi',
    'Loại Hình Đào Tạo',
    'Ngày Thi',
    'Tên Ban',
    'Mã Ban',
    'Vai Trò Đảm Nhận',
    'Môn / Nhiệm Vụ Phụ Trách',
    'Ghi Chú',
  ];

  const rows: (string | number)[][] = [];
  let stt = 1;

  for (const p of personnel) {
    const myAssignments = allAssignments.filter((a) => a.personnelId === p.id);
    if (myAssignments.length === 0) {
      rows.push([
        stt++, p.fullName, p.academicTitle, p.department, p.position,
        '', '', '', '', '', '', '', '', '',
      ]);
      continue;
    }
    for (const asgn of myAssignments) {
      const board = allBoards.find((b) => b.id === asgn.examBoardId);
      const exam = board ? exams.find((e) => e.id === board.examId) : undefined;
      const tt = exam ? trainingTypes.find((t) => t.id === exam.trainingTypeId) : undefined;
      rows.push([
        stt++,
        p.fullName,
        p.academicTitle,
        p.department,
        p.position,
        exam?.code ?? '',
        exam?.name ?? '',
        tt?.name ?? '',
        exam ? fmtDate(exam.examDate) : '',
        board?.boardName ?? '',
        board?.boardCode ?? '',
        asgn.roleName,
        asgn.assignedSubject ?? '',
        asgn.notes ?? '',
      ]);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  applyHeaderStyle(ws, { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } });
  setColWidths(ws, [5, 22, 14, 28, 22, 16, 48, 28, 12, 24, 12, 24, 30, 20]);
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  return ws;
}

// ─── Sheet 3: Theo Thời Gian ─────────────────────────────────────────────────

function buildTimelineSheet(
  exams: Exam[],
  trainingTypes: TrainingType[],
  allBoards: ExamBoard[],
  allAssignments: BoardMemberAssignment[]
): XLSX.WorkSheet {
  const headers = [
    'STT',
    'Năm',
    'Tháng',
    'Mã Kỳ Thi',
    'Tên Kỳ Thi',
    'Loại Hình Đào Tạo',
    'Khóa',
    'Địa Điểm',
    'Số Môn',
    'Số Phòng',
    'Tổng SV',
    'Số Ban',
    'Tổng NS Tham Gia',
    'Trạng Thái',
  ];

  // Sort by examDate ascending
  const sorted = [...exams].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  const rows = sorted.map((exam, i) => {
    const d = new Date(exam.examDate);
    const year = isNaN(d.getTime()) ? '' : d.getFullYear();
    const month = isNaN(d.getTime()) ? '' : d.getMonth() + 1;
    const tt = trainingTypes.find((t) => t.id === exam.trainingTypeId);
    const boards = allBoards.filter((b) => b.examId === exam.id);
    const boardIds = boards.map((b) => b.id);
    const assignments = allAssignments.filter((a) => boardIds.includes(a.examBoardId));
    const uniquePersonnel = new Set(assignments.map((a) => a.personnelId));

    return [
      i + 1,
      year,
      month,
      exam.code,
      exam.name,
      tt?.name ?? 'Chưa rõ',
      exam.cohort,
      exam.location,
      exam.totalSubjects,
      exam.totalRooms,
      exam.totalRooms * exam.studentsPerRoom,
      boards.length,
      uniquePersonnel.size,
      STATUS_LABEL[exam.status] ?? exam.status,
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  applyHeaderStyle(ws, { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } });
  setColWidths(ws, [5, 8, 8, 18, 48, 28, 22, 30, 10, 10, 12, 8, 18, 22]);
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  return ws;
}

// ─── Sheet 4: Thống Kê Nhân Sự (Pivot) ───────────────────────────────────────

function buildPersonnelPivotSheet(
  personnel: Personnel[],
  exams: Exam[],
  allBoards: ExamBoard[],
  allAssignments: BoardMemberAssignment[]
): XLSX.WorkSheet {
  const headers = [
    'STT',
    'Họ và Tên',
    'Học Hàm / Học Vị',
    'Đơn Vị / Khoa Phòng',
    'Chức Vụ',
    'Số Kỳ Thi Tham Gia',
    'Danh Sách Kỳ Thi',
    'Số Ban Tham Gia',
    'Các Vai Trò Đảm Nhận',
    'Các Ban Tham Gia',
  ];

  const rows = personnel.map((p, i) => {
    const myAssignments = allAssignments.filter((a) => a.personnelId === p.id);
    const boardIds = [...new Set(myAssignments.map((a) => a.examBoardId))];
    const boards = allBoards.filter((b) => boardIds.includes(b.id));
    const examIds = [...new Set(boards.map((b) => b.examId))];
    const involvedExams = exams.filter((e) => examIds.includes(e.id));
    const roles = [...new Set(myAssignments.map((a) => a.roleName))];
    const boardNames = [...new Set(boards.map((b) => b.boardName))];

    return [
      i + 1,
      p.fullName,
      p.academicTitle,
      p.department,
      p.position,
      involvedExams.length,
      involvedExams.map((e) => e.code).join('; '),
      boards.length,
      roles.join('; '),
      boardNames.join('; '),
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  applyHeaderStyle(ws, { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } });
  setColWidths(ws, [5, 22, 14, 28, 22, 16, 40, 14, 40, 40]);
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  return ws;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ExportParams {
  exams: Exam[];
  trainingTypes: TrainingType[];
  personnel: Personnel[];
  allBoards: ExamBoard[];
  allAssignments: BoardMemberAssignment[];
}

/** Xuất báo cáo tổng hợp đầy đủ (4 sheet) */
export function exportFullReportToExcel(params: ExportParams): void {
  const { exams, trainingTypes, personnel, allBoards, allAssignments } = params;
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    buildExamSummarySheet(exams, trainingTypes, allBoards, allAssignments),
    'Tổng Hợp Kỳ Thi'
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildPersonnelDetailSheet(personnel, exams, allBoards, allAssignments, trainingTypes),
    'Chi Tiết Nhân Sự'
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildTimelineSheet(exams, trainingTypes, allBoards, allAssignments),
    'Theo Thời Gian'
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildPersonnelPivotSheet(personnel, exams, allBoards, allAssignments),
    'Thống Kê Nhân Sự'
  );

  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(wb, `BaoCao_KyThi_ToanBo_${stamp}.xlsx`);
}

/** Xuất sheet Tổng Hợp Kỳ Thi */
export function exportExamSummaryExcel(params: ExportParams): void {
  const { exams, trainingTypes, allBoards, allAssignments } = params;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    buildExamSummarySheet(exams, trainingTypes, allBoards, allAssignments),
    'Tổng Hợp Kỳ Thi'
  );
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(wb, `ThongKe_KyThi_${stamp}.xlsx`);
}

/** Xuất sheet Chi Tiết Nhân Sự */
export function exportPersonnelExcel(params: ExportParams): void {
  const { exams, trainingTypes, personnel, allBoards, allAssignments } = params;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    buildPersonnelDetailSheet(personnel, exams, allBoards, allAssignments, trainingTypes),
    'Chi Tiết Nhân Sự'
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildPersonnelPivotSheet(personnel, exams, allBoards, allAssignments),
    'Thống Kê Nhân Sự'
  );
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(wb, `ThongKe_NhanSu_${stamp}.xlsx`);
}

/** Xuất sheet Theo Thời Gian */
export function exportTimelineExcel(params: ExportParams): void {
  const { exams, trainingTypes, allBoards, allAssignments } = params;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    buildTimelineSheet(exams, trainingTypes, allBoards, allAssignments),
    'Theo Thời Gian'
  );
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  XLSX.writeFile(wb, `ThongKe_ThoiGian_${stamp}.xlsx`);
}
