import type { Exam, ExamBoard, BoardMemberAssignment, Personnel, TrainingType } from '../types/schema';
import { storage } from './storage';

export interface RenderContext {
  exam: Exam;
  board?: ExamBoard;
  assignments?: BoardMemberAssignment[];
  personnelList?: Personnel[];
  trainingType?: TrainingType;
}

export interface AvailablePlaceholder {
  tag: string;
  label: string;
  category: 'Kỳ thi' | 'Ban & Thành viên' | 'Bảng tự động';
  example: string;
}

export const AVAILABLE_PLACEHOLDERS: AvailablePlaceholder[] = [
  // Kỳ thi
  { tag: '{{KyThi.Ten}}', label: 'Tên kỳ thi', category: 'Kỳ thi', example: 'Kỳ thi Tốt nghiệp Lớp Cao cấp LLCT Khóa 72' },
  { tag: '{{KyThi.Ma}}', label: 'Mã kỳ thi', category: 'Kỳ thi', example: 'KTHI-LLCT-K72' },
  { tag: '{{KyThi.KhoaTotNghiep}}', label: 'Khóa tốt nghiệp', category: 'Kỳ thi', example: 'Khóa 72 (2024-2026)' },
  { tag: '{{KyThi.NgayThi}}', label: 'Thời gian thi', category: 'Kỳ thi', example: '15/08/2026' },
  { tag: '{{KyThi.DiaDiem}}', label: 'Địa điểm tổ chức', category: 'Kỳ thi', example: 'Hội trường A & Nhà Học 5 Tầng' },
  { tag: '{{KyThi.LoaiHinhDaoTao}}', label: 'Loại hình đào tạo', category: 'Kỳ thi', example: 'Cao cấp Lý luận chính trị' },
  { tag: '{{KyThi.SoMon}}', label: 'Số lượng môn thi', category: 'Kỳ thi', example: '4' },
  { tag: '{{KyThi.SoPhong}}', label: 'Số lượng phòng thi', category: 'Kỳ thi', example: '6' },
  { tag: '{{KyThi.SoSinhVienPhong}}', label: 'Số SV / phòng thi', category: 'Kỳ thi', example: '35' },

  // Ban & Thành viên
  { tag: '{{Ban.Ten}}', label: 'Tên Ban chuyên trách', category: 'Ban & Thành viên', example: 'Ban Coi thi' },
  { tag: '{{Ban.TruongBan.HoTen}}', label: 'Họ tên Trưởng Ban', category: 'Ban & Thành viên', example: 'GS.TS Nguyễn Văn An' },
  { tag: '{{Ban.TruongBan.ChucVu}}', label: 'Chức danh Trưởng Ban', category: 'Ban & Thành viên', example: 'GS.TS - Trưởng Khoa' },
  { tag: '{{Ban.PhoTruongBan.HoTen}}', label: 'Họ tên Phó Trưởng Ban', category: 'Ban & Thành viên', example: 'PGS.TS Trần Thị Bình' },
  { tag: '{{Ban.PhoTruongBan.ChucVu}}', label: 'Chức danh Phó Trưởng Ban', category: 'Ban & Thành viên', example: 'PGS.TS - Phó Trưởng Khoa' },
  { tag: '{{Ban.ThuKy.HoTen}}', label: 'Họ tên Thư ký', category: 'Ban & Thành viên', example: 'ThS Đặng Quốc Khánh' },
  { tag: '{{Ban.ThuKy.ChucVu}}', label: 'Chức danh Thư ký', category: 'Ban & Thành viên', example: 'ThS - Chuyên viên Khảo thí' },

  // Bảng tự động
  { tag: '{{DanhSach.ThanhVien.Bang}}', label: 'Bảng danh sách Thành viên Ban', category: 'Bảng tự động', example: '[Bảng HTML tự động]' },
  { tag: '{{DanhSach.MonThi.Bang}}', label: 'Bảng danh sách Môn thi', category: 'Bảng tự động', example: '[Bảng HTML tự động]' }
];

export function renderTemplateHtml(htmlContent: string, exam: Exam, board?: ExamBoard): string {
  const allPersonnel = storage.getPersonnel();
  const allTrainingTypes = storage.getTrainingTypes();
  const trainingType = allTrainingTypes.find(t => t.id === exam.trainingTypeId);
  
  let assignments: BoardMemberAssignment[] = [];
  if (board) {
    assignments = storage.getAssignments(board.id);
  }

  // Find Leader, Deputy Leader, Secretary
  let tbName = '........................';
  let tbTitle = '........................';
  let ptbName = '........................';
  let ptbTitle = '........................';
  let tkName = '........................';
  let tkTitle = '........................';

  assignments.forEach(as => {
    const p = allPersonnel.find(x => x.id === as.personnelId);
    if (!p) return;
    const fullTitle = `${p.academicTitle ? p.academicTitle + ' ' : ''}${p.position || p.department}`;

    const roleLower = as.roleName.toLowerCase();
    if (roleLower.includes('trưởng ban') && !roleLower.includes('phó')) {
      tbName = `${p.academicTitle ? p.academicTitle + ' ' : ''}${p.fullName}`;
      tbTitle = fullTitle;
    } else if (roleLower.includes('phó trưởng ban') || roleLower.includes('phó ban')) {
      ptbName = `${p.academicTitle ? p.academicTitle + ' ' : ''}${p.fullName}`;
      ptbTitle = fullTitle;
    } else if (roleLower.includes('thư ký')) {
      tkName = `${p.academicTitle ? p.academicTitle + ' ' : ''}${p.fullName}`;
      tkTitle = fullTitle;
    }
  });

  // Generate Member Table
  let memberTableHtml = '';
  if (assignments.length > 0) {
    memberTableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13pt;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #333; padding: 6px; text-align: center; width: 40px;">STT</th>
            <th style="border: 1px solid #333; padding: 6px; text-align: left;">Họ và tên</th>
            <th style="border: 1px solid #333; padding: 6px; text-align: left;">Đơn vị công tác</th>
            <th style="border: 1px solid #333; padding: 6px; text-align: center; width: 140px;">Vai trò trong Ban</th>
            <th style="border: 1px solid #333; padding: 6px; text-align: left;">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${assignments.map((as, index) => {
            const p = allPersonnel.find(x => x.id === as.personnelId);
            return `
              <tr>
                <td style="border: 1px solid #333; padding: 6px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #333; padding: 6px; font-weight: bold;">${p ? (p.academicTitle ? p.academicTitle + ' ' : '') + p.fullName : 'N/A'}</td>
                <td style="border: 1px solid #333; padding: 6px;">${p ? p.department : 'N/A'}</td>
                <td style="border: 1px solid #333; padding: 6px; text-align: center; font-weight: 500;">${as.roleName}</td>
                <td style="border: 1px solid #333; padding: 6px;">${as.assignedSubject || as.notes || ''}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  } else {
    memberTableHtml = '<p style="font-style: italic; color: #666;">(Chưa phân công thành viên)</p>';
  }

  // Generate Subject Table
  let subjectTableHtml = '';
  if (exam.subjectsList && exam.subjectsList.length > 0) {
    subjectTableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13pt;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #333; padding: 6px; text-align: center; width: 50px;">STT</th>
            <th style="border: 1px solid #333; padding: 6px; text-align: left;">Tên môn thi tốt nghiệp</th>
            <th style="border: 1px solid #333; padding: 6px; text-align: center; width: 120px;">Hình thức thi</th>
          </tr>
        </thead>
        <tbody>
          ${exam.subjectsList.map((sub, idx) => `
            <tr>
              <td style="border: 1px solid #333; padding: 6px; text-align: center;">${idx + 1}</td>
              <td style="border: 1px solid #333; padding: 6px; font-weight: 500;">${sub}</td>
              <td style="border: 1px solid #333; padding: 6px; text-align: center;">Viết / Tự luận</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else {
    subjectTableHtml = '<p style="font-style: italic; color: #666;">(Chưa cập nhật danh sách môn thi)</p>';
  }

  // Formatted date string
  const examDateObj = new Date(exam.examDate || Date.now());
  const dateStr = `${examDateObj.getDate()} tháng ${examDateObj.getMonth() + 1} năm ${examDateObj.getFullYear()}`;

  // Replace all placeholder tags
  let result = htmlContent;
  
  // Exam replacements
  result = result.replace(/\{\{KyThi\.Ten\}\}/g, exam.name || '');
  result = result.replace(/\{\{KyThi\.Ma\}\}/g, exam.code || '');
  result = result.replace(/\{\{KyThi\.KhoaTotNghiep\}\}/g, exam.cohort || '');
  result = result.replace(/\{\{KyThi\.Khoa\}\}/g, exam.cohort || '');
  result = result.replace(/\{\{KyThi\.NgayThi\}\}/g, dateStr);
  result = result.replace(/\{\{KyThi\.DiaDiem\}\}/g, exam.location || 'Địa điểm thi');
  result = result.replace(/\{\{KyThi\.LoaiHinhDaoTao\}\}/g, trainingType ? trainingType.name : 'Đại học');
  result = result.replace(/\{\{KyThi\.SoMon\}\}/g, String(exam.totalSubjects || 0));
  result = result.replace(/\{\{KyThi\.SoPhong\}\}/g, String(exam.totalRooms || 0));
  result = result.replace(/\{\{KyThi\.SoSinhVienPhong\}\}/g, String(exam.studentsPerRoom || 0));

  // Board replacements
  result = result.replace(/\{\{Ban\.Ten\}\}/g, board ? board.boardName : 'Ban chuyên trách');
  result = result.replace(/\{\{Ban\.Ma\}\}/g, board ? board.boardCode : '');

  // Leader / Secretary replacements
  result = result.replace(/\{\{Ban\.TruongBan\.HoTen\}\}/g, tbName);
  result = result.replace(/\{\{Ban\.TruongBan\.ChucVu\}\}/g, tbTitle);
  result = result.replace(/\{\{Ban\.PhoTruongBan\.HoTen\}\}/g, ptbName);
  result = result.replace(/\{\{Ban\.PhoTruongBan\.ChucVu\}\}/g, ptbTitle);
  result = result.replace(/\{\{Ban\.ThuKy\.HoTen\}\}/g, tkName);
  result = result.replace(/\{\{Ban\.ThuKy\.ChucVu\}\}/g, tkTitle);

  // Dynamic tables replacements
  result = result.replace(/\{\{DanhSach\.ThanhVien\.Bang\}\}/g, memberTableHtml);
  result = result.replace(/\{\{DanhSach\.MonThi\.Bang\}\}/g, subjectTableHtml);

  return result;
}
