import type { TrainingType, Personnel, Exam, ExamBoard, BoardMemberAssignment, FormTemplate } from '../types/schema';

export const INITIAL_TRAINING_TYPES: TrainingType[] = [
  {
    id: 'tt-1',
    code: 'LLCT',
    name: 'Cao cấp Lý luận chính trị',
    description: 'Hệ đào tạo Cao cấp Lý luận chính trị tập trung và không tập trung',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tt-2',
    code: 'DH_CQ',
    name: 'Đại học Chính quy',
    description: 'Đào tạo cử nhân chính quy các ngành',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tt-3',
    code: 'DH_VLVH',
    name: 'Đại học Vừa làm vừa học',
    description: 'Đào tạo liên thông và vừa làm vừa học',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tt-4',
    code: 'BD_CB',
    name: 'Bồi dưỡng Cán bộ Quản lý',
    description: 'Các khóa bồi dưỡng cập nhật kiến thức cán bộ quản lý',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PERSONNEL: Personnel[] = [
  {
    id: 'p-1',
    fullName: 'Nguyễn Văn An',
    academicTitle: 'GS.TS',
    department: 'Khoa Xây dựng Đảng',
    position: 'Trưởng Khoa',
    phone: '0912345678',
    email: 'nvan@edu.vn',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-2',
    fullName: 'Trần Thị Bình',
    academicTitle: 'PGS.TS',
    department: 'Khoa Triết học',
    position: 'Phó Trưởng Khoa',
    phone: '0987654321',
    email: 'ttbinh@edu.vn',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-3',
    fullName: 'Lê Hoàng Cường',
    academicTitle: 'TS',
    department: 'Phòng Quản lý Đào tạo',
    position: 'Trưởng phòng',
    phone: '0903112233',
    email: 'lhcuong@edu.vn',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-4',
    fullName: 'Phạm Minh Đức',
    academicTitle: 'ThS',
    department: 'Phòng Thanh tra & Khảo thí',
    position: 'Phó Trưởng phòng',
    phone: '0977889900',
    email: 'pmduc@edu.vn',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-5',
    fullName: 'Vũ Thị Thanh Hương',
    academicTitle: 'TS',
    department: 'Khoa Kinh tế Chính trị',
    position: 'Giảng viên chính',
    phone: '0933445566',
    email: 'vtthuong@edu.vn',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-6',
    fullName: 'Đặng Quốc Khánh',
    academicTitle: 'ThS',
    department: 'Phòng Quản lý Đào tạo',
    position: 'Chuyên viên Khảo thí',
    phone: '0944556677',
    email: 'dqkhanh@edu.vn',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-7',
    fullName: 'Nông Văn Thắng',
    academicTitle: 'PGS.TS',
    department: 'Khoa Nhà nước & Pháp luật',
    position: 'Trưởng Khoa',
    phone: '0911223344',
    email: 'nvthang@edu.vn',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-8',
    fullName: 'Ngô Mỹ Linh',
    academicTitle: 'CN',
    department: 'Phòng Hành chính - Quản trị',
    position: 'Thư ký văn phòng',
    phone: '0966778899',
    email: 'nmlinh@edu.vn',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex-1',
    code: 'KTHI-LLCT-K72',
    name: 'Kỳ thi Tốt nghiệp Lớp Cao cấp Lý luận Chính trị Khóa 72 (2024 - 2026)',
    trainingTypeId: 'tt-1',
    cohort: 'Khóa 72 (2024-2026)',
    examDate: '2026-08-15',
    location: 'Hội trường A & Nhà Học 5 Tầng',
    totalSubjects: 4,
    totalRooms: 6,
    studentsPerRoom: 35,
    subjectsList: [
      'Môn 1: Triết học Mác - Lênin',
      'Môn 2: Kinh tế Chính trị Mác - Lênin',
      'Môn 3: Chủ nghĩa Xã hội Khoa học',
      'Môn 4: Lịch sử Đảng Cộng sản Việt Nam'
    ],
    status: 'planning',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ex-2',
    code: 'KTHI-DH-K15',
    name: 'Kỳ thi Tốt nghiệp Hệ Đại học Chính quy Khóa 15',
    trainingTypeId: 'tt-2',
    cohort: 'Khóa 15 (2022-2026)',
    examDate: '2026-09-01',
    location: 'Khu giảng đường B',
    totalSubjects: 3,
    totalRooms: 8,
    studentsPerRoom: 40,
    subjectsList: [
      'Môn 1: Quản lý Nhà nước về Kinh tế',
      'Môn 2: Luật Hành chính Việt Nam',
      'Môn 3: Phương pháp luận Nghiên cứu Khoa học'
    ],
    status: 'planning',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BOARDS: ExamBoard[] = [
  {
    id: 'b-1',
    examId: 'ex-1',
    boardCode: 'DE_THI',
    boardName: 'Ban Đề thi',
    description: 'Phụ trách tổ hợp, nhân sao, niêm phong và bảo mật đề thi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b-2',
    examId: 'ex-1',
    boardCode: 'COI_THI',
    boardName: 'Ban Coi thi',
    description: 'Phụ trách tổ chức coi thi, điểm danh, giao nhận bài thi tại phòng thi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b-3',
    examId: 'ex-1',
    boardCode: 'PHACH',
    boardName: 'Ban Phách',
    description: 'Phụ trách dồn túi, làm phách, đánh số phách và niêm phong đầu phách',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b-4',
    examId: 'ex-1',
    boardCode: 'CHAM_THI',
    boardName: 'Ban Chấm thi',
    description: 'Phụ trách chấm bài thi, tổng hợp điểm thi các môn tốt nghiệp',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b-5',
    examId: 'ex-1',
    boardCode: 'GIAM_SAT',
    boardName: 'Ban Kiểm tra Giám sát',
    description: 'Phụ trách kiểm tra, giám sát tính kỷ luật và quy chế kỳ thi',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_ASSIGNMENTS: BoardMemberAssignment[] = [
  // Ban Đề thi
  { id: 'as-1', examBoardId: 'b-1', personnelId: 'p-1', roleName: 'Trưởng Ban', assignedSubject: 'Toàn bộ các môn' },
  { id: 'as-2', examBoardId: 'b-1', personnelId: 'p-2', roleName: 'Phó Trưởng Ban', assignedSubject: 'Môn Triết học & Kinh tế' },
  { id: 'as-3', examBoardId: 'b-1', personnelId: 'p-6', roleName: 'Thư ký', assignedSubject: 'Tổng hợp đáp án' },
  
  // Ban Coi thi
  { id: 'as-4', examBoardId: 'b-2', personnelId: 'p-3', roleName: 'Trưởng Ban', assignedSubject: 'Phụ trách chung' },
  { id: 'as-5', examBoardId: 'b-2', personnelId: 'p-5', roleName: 'Phó Trưởng Ban', assignedSubject: 'Điều hành phòng thi' },
  { id: 'as-6', examBoardId: 'b-2', personnelId: 'p-8', roleName: 'Thư ký', assignedSubject: 'Giao nhận bài thi' },

  // Ban Phách
  { id: 'as-7', examBoardId: 'b-3', personnelId: 'p-4', roleName: 'Trưởng Ban', assignedSubject: 'Chấm phách độc lập' },
  { id: 'as-8', examBoardId: 'b-3', personnelId: 'p-6', roleName: 'Thư ký', assignedSubject: 'Khóa mã phách' },

  // Ban Chấm thi
  { id: 'as-9', examBoardId: 'b-4', personnelId: 'p-7', roleName: 'Trưởng Ban', assignedSubject: 'Phụ trách chấm thi' },
  { id: 'as-10', examBoardId: 'b-4', personnelId: 'p-1', roleName: 'Trưởng Môn thi', assignedSubject: 'Triết học Mác - Lênin' },
  { id: 'as-11', examBoardId: 'b-4', personnelId: 'p-2', roleName: 'Phản biện', assignedSubject: 'Kinh tế chính trị' },

  // Ban Giám sát
  { id: 'as-12', examBoardId: 'b-5', personnelId: 'p-4', roleName: 'Trưởng Ban', assignedSubject: 'Thanh tra toàn khóa' }
];

export const INITIAL_TEMPLATES: FormTemplate[] = [
  {
    id: 'tmpl-1',
    boardCode: 'DE_THI',
    templateCode: 'DE_THI_01',
    title: 'Biên bản Tổ hợp và Nhân sao Đề thi',
    description: 'Sử dụng cho Ban Đề thi lập biên bản tổ hợp và nhân sao đề thi bí mật',
    htmlContent: `
<div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000;">
  <table style="width: 100%; border: none; margin-bottom: 20px;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">ĐƠN VỊ TỔ CHỨC ĐÀO TẠO</strong><br>
        <strong style="font-size: 12pt; text-decoration: underline;">BAN ĐỀ THI TỐT NGHIỆP</strong>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
        <strong style="font-size: 12pt;">Độc lập - Tự do - Hạnh phúc</strong><br>
        <div style="border-bottom: 1px solid #000; width: 60%; margin: 4px auto 0 auto;"></div>
      </td>
    </tr>
  </table>

  <div style="text-align: center; margin: 25px 0;">
    <h2 style="font-size: 16pt; text-transform: uppercase; margin: 0;">BIÊN BẢN TỔ HỢP VÀ NHÂN SAO ĐỀ THI TỐT NGHIỆP</h2>
    <p style="font-style: italic; margin-top: 5px;">(Thuộc: {{KyThi.Ten}})</p>
  </div>

  <p>Hôm nay, vào lúc ..... giờ ..... phút, ngày ..... tháng ..... năm 2026, tại {{KyThi.DiaDiem}}.</p>

  <p><strong>I. THÀNH PHẦN THỰC HIỆN (BAN ĐỀ THI):</strong></p>
  <p>1. Ông/Bà: <strong>{{Ban.TruongBan.HoTen}}</strong> - Chức vụ/Học vị: {{Ban.TruongBan.ChucVu}} - Vai trò: Trưởng Ban Đề thi</p>
  <p>2. Ông/Bà: <strong>{{Ban.PhoTruongBan.HoTen}}</strong> - Chức vụ/Học vị: {{Ban.PhoTruongBan.ChucVu}} - Vai trò: Phó Trưởng Ban</p>
  <p>3. Ông/Bà: <strong>{{Ban.ThuKy.HoTen}}</strong> - Chức vụ/Học vị: {{Ban.ThuKy.ChucVu}} - Vai trò: Thư ký ghi biên bản</p>

  <p><strong>II. NỘI DUNG TỔ HỢP VÀ NHÂN SAO:</strong></p>
  <p>- Loại hình đào tạo: <strong>{{KyThi.LoaiHinhDaoTao}}</strong></p>
  <p>- Khóa tốt nghiệp: <strong>{{KyThi.KhoaTotNghiep}}</strong></p>
  <p>- Tổng số môn thi tốt nghiệp: <strong>{{KyThi.SoMon}} môn</strong></p>
  <p>- Tổng số phòng thi: <strong>{{KyThi.SoPhong}} phòng</strong> (Tổng số sinh viên/phòng: {{KyThi.SoSinhVienPhong}} sinh viên)</p>
  
  <p style="margin-top: 10px;"><strong>Danh sách môn thi tổ hợp:</strong></p>
  {{DanhSach.MonThi.Bang}}

  <p style="margin-top: 15px;"><strong>III. ĐÁNH GIÁ VÀ NIÊM PHONG:</strong></p>
  <p>- Đề thi được tổ hợp đúng cấu trúc quy định, bảo đảm chính xác, bảo mật tuyệt đối.</p>
  <p>- Toàn bộ bản gốc, bản sao và phế phẩm nhân sao đã được niêm phong theo đúng quy chế thi tốt nghiệp.</p>

  <p>Biên bản kết thúc vào lúc ..... giờ ..... phút cùng ngày, đã được đọc lại cho các thành viên cùng nghe và thống nhất ký tên.</p>

  <table style="width: 100%; border: none; margin-top: 30px; text-align: center;">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <strong>THƯ KÝ BAN ĐỀ THI</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.ThuKy.HoTen}}</strong>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <strong>TRƯỞNG BAN ĐỀ THI</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.TruongBan.HoTen}}</strong>
      </td>
    </tr>
  </table>
</div>
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tmpl-2',
    boardCode: 'COI_THI',
    templateCode: 'COI_THI_01',
    title: 'Biên bản Giao nhận Đề thi và Bài thi Tốt nghiệp',
    description: 'Sử dụng cho Ban Coi thi trong việc giao nhận túi đề thi và bài thi tốt nghiệp giữa các phòng thi',
    htmlContent: `
<div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000;">
  <table style="width: 100%; border: none; margin-bottom: 20px;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">HỘI ĐỒNG THI TỐT NGHIỆP</strong><br>
        <strong style="font-size: 12pt; text-decoration: underline;">BAN COI THI</strong>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
        <strong style="font-size: 12pt;">Độc lập - Tự do - Hạnh phúc</strong><br>
        <div style="border-bottom: 1px solid #000; width: 60%; margin: 4px auto 0 auto;"></div>
      </td>
    </tr>
  </table>

  <div style="text-align: center; margin: 20px 0;">
    <h2 style="font-size: 16pt; text-transform: uppercase; margin: 0;">BIÊN BẢN GIAO NHẬN ĐỀ THI VÀ BÀI THI</h2>
    <p style="font-style: italic; margin-top: 5px;">{{KyThi.Ten}} - {{KyThi.KhoaTotNghiep}}</p>
  </div>

  <p><strong>Thời gian thực hiện:</strong> ..... giờ ..... phút, Ngày {{KyThi.NgayThi}}</p>
  <p><strong>Địa điểm:</strong> {{KyThi.DiaDiem}}</p>

  <p><strong>A. ĐẠI DIỆN BAN COI THI (BÊN GIAO / NHẬN):</strong></p>
  <p>- Trưởng Ban Coi thi: <strong>{{Ban.TruongBan.HoTen}}</strong> ({{Ban.TruongBan.ChucVu}})</p>
  <p>- Thư ký Ban Coi thi: <strong>{{Ban.ThuKy.HoTen}}</strong> ({{Ban.ThuKy.ChucVu}})</p>

  <p><strong>B. NỘI DUNG GIAO NHẬN:</strong></p>
  <p>1. Tổng số túi đề thi giao cho các phòng thi: <strong>{{KyThi.SoPhong}} túi</strong> (Nguyên niêm phong của Ban Đề thi).</p>
  <p>2. Tổng số bài thi thu hồi sau giờ thi: ..... bài thi / tổng số {{KyThi.SoSinhVienPhong}} thí sinh dự thi.</p>

  <p style="margin-top: 15px;"><strong>CƠ CẤU NHÂN SỰ BAN COI THI THỰC HIỆN:</strong></p>
  {{DanhSach.ThanhVien.Bang}}

  <p style="margin-top: 15px;">Biên bản được lập thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản.</p>

  <table style="width: 100%; border: none; margin-top: 30px; text-align: center;">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <strong>THƯ KÝ BAN COI THI</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.ThuKy.HoTen}}</strong>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <strong>TRƯỞNG BAN COI THI</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.TruongBan.HoTen}}</strong>
      </td>
    </tr>
  </table>
</div>
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tmpl-3',
    boardCode: 'PHACH',
    templateCode: 'PHACH_01',
    title: 'Biên bản Dồn túi và Đánh số Phách Bài thi',
    description: 'Sử dụng cho Ban Phách trong việc cắt phách, dồn túi bài thi và bảo mật đầu phách',
    htmlContent: `
<div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000;">
  <table style="width: 100%; border: none; margin-bottom: 20px;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">HỘI ĐỒNG THI TỐT NGHIỆP</strong><br>
        <strong style="font-size: 12pt; text-decoration: underline;">BAN PHÁCH</strong>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
        <strong style="font-size: 12pt;">Độc lập - Tự do - Hạnh phúc</strong><br>
        <div style="border-bottom: 1px solid #000; width: 60%; margin: 4px auto 0 auto;"></div>
      </td>
    </tr>
  </table>

  <div style="text-align: center; margin: 20px 0;">
    <h2 style="font-size: 16pt; text-transform: uppercase; margin: 0;">BIÊN BẢN DỒN TÚI VÀ ĐÁNH SỐ PHÁCH BÀI THI</h2>
    <p style="font-style: italic; margin-top: 5px;">{{KyThi.Ten}}</p>
  </div>

  <p>Hôm nay, ngày {{KyThi.NgayThi}}, Ban Phách tiến hành dồn túi và đánh số phách cho bài thi tốt nghiệp.</p>

  <p><strong>1. THÀNH PHẦN BAN PHÁCH:</strong></p>
  <p>- Trưởng Ban Phách: <strong>{{Ban.TruongBan.HoTen}}</strong> (Chức vụ: {{Ban.TruongBan.ChucVu}})</p>
  <p>- Thư ký Ban Phách: <strong>{{Ban.ThuKy.HoTen}}</strong> (Chức vụ: {{Ban.ThuKy.ChucVu}})</p>

  <p><strong>2. KẾT QUẢ ĐÁNH SỐ PHÁCH:</strong></p>
  <p>- Tổng số bài thi nhận từ Ban Coi thi: ..... bài.</p>
  <p>- Số lượng túi bài thi đã dồn: ..... túi phách.</p>
  <p>- Tình trạng niêm phong đầu phách: Đã khóa mã phách và niêm phong trong hòm sắt an toàn.</p>

  <table style="width: 100%; border: none; margin-top: 35px; text-align: center;">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <strong>THƯ KÝ BAN PHÁCH</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.ThuKy.HoTen}}</strong>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <strong>TRƯỞNG BAN PHÁCH</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.TruongBan.HoTen}}</strong>
      </td>
    </tr>
  </table>
</div>
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tmpl-4',
    boardCode: 'CHAM_THI',
    templateCode: 'CHAM_THI_01',
    title: 'Biên bản Thống nhất Điểm Chấm thi Tốt nghiệp',
    description: 'Sử dụng cho Ban Chấm thi lập biên bản đối thoại thống nhất điểm bài thi tốt nghiệp',
    htmlContent: `
<div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000;">
  <table style="width: 100%; border: none; margin-bottom: 20px;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">HỘI ĐỒNG THI TỐT NGHIỆP</strong><br>
        <strong style="font-size: 12pt; text-decoration: underline;">BAN CHẤM THI</strong>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
        <strong style="font-size: 12pt;">Độc lập - Tự do - Hạnh phúc</strong><br>
        <div style="border-bottom: 1px solid #000; width: 60%; margin: 4px auto 0 auto;"></div>
      </td>
    </tr>
  </table>

  <div style="text-align: center; margin: 20px 0;">
    <h2 style="font-size: 16pt; text-transform: uppercase; margin: 0;">BIÊN BẢN THỐNG NHẤT ĐIỂM CHẤM THI TỐT NGHIỆP</h2>
    <p style="font-style: italic; margin-top: 5px;">{{KyThi.Ten}} - {{KyThi.KhoaTotNghiep}}</p>
  </div>

  <p><strong>Ban Chấm thi tốt nghiệp gồm các thành viên:</strong></p>
  <p>- Trưởng Ban Chấm thi: <strong>{{Ban.TruongBan.HoTen}}</strong></p>
  <p>- Thư ký Ban Chấm thi: <strong>{{Ban.ThuKy.HoTen}}</strong></p>

  <p><strong>Nội dung:</strong> Đã tiến hành chấm thi độc lập 02 vòng và thống nhất bảng điểm bài thi cho toàn bộ {{KyThi.SoSinhVienPhong}} thí sinh/phòng thi.</p>

  <p style="margin-top: 15px;"><strong>DANH SÁCH THÀNH VIÊN THAM GIA CHẤM THI:</strong></p>
  {{DanhSach.ThanhVien.Bang}}

  <table style="width: 100%; border: none; margin-top: 35px; text-align: center;">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <strong>THƯ KÝ BAN CHẤM THI</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.ThuKy.HoTen}}</strong>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <strong>TRƯỞNG BAN CHẤM THI</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.TruongBan.HoTen}}</strong>
      </td>
    </tr>
  </table>
</div>
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tmpl-5',
    boardCode: 'GIAM_SAT',
    templateCode: 'GIAM_SAT_01',
    title: 'Biên bản Kiểm tra Giám sát Quy chế Kỳ thi',
    description: 'Sử dụng cho Ban Kiểm tra Giám sát lập biên bản thanh tra toàn bộ các khâu kỳ thi tốt nghiệp',
    htmlContent: `
<div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000;">
  <table style="width: 100%; border: none; margin-bottom: 20px;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">HỘI ĐỒNG THI TỐT NGHIỆP</strong><br>
        <strong style="font-size: 12pt; text-decoration: underline;">BAN KIỂM TRA GIÁM SÁT</strong>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <strong style="font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
        <strong style="font-size: 12pt;">Độc lập - Tự do - Hạnh phúc</strong><br>
        <div style="border-bottom: 1px solid #000; width: 60%; margin: 4px auto 0 auto;"></div>
      </td>
    </tr>
  </table>

  <div style="text-align: center; margin: 20px 0;">
    <h2 style="font-size: 16pt; text-transform: uppercase; margin: 0;">BIÊN BẢN KIỂM TRA GIÁM SÁT KỲ THI TỐT NGHIỆP</h2>
    <p style="font-style: italic; margin-top: 5px;">{{KyThi.Ten}}</p>
  </div>

  <p><strong>Trưởng Ban Giám sát:</strong> <strong>{{Ban.TruongBan.HoTen}}</strong> ({{Ban.TruongBan.ChucVu}})</p>
  <p><strong>Thư ký:</strong> <strong>{{Ban.ThuKy.HoTen}}</strong></p>

  <p><strong>Kết quả thanh tra:</strong></p>
  <p>- Công tác niêm phong đề thi, chuẩn bị phòng thi ({{KyThi.SoPhong}} phòng) đúng quy chế.</p>
  <p>- Không phát hiện vi phạm nghiêm trọng trong suốt thời gian diễn ra kỳ thi.</p>

  <table style="width: 100%; border: none; margin-top: 35px; text-align: center;">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <strong>THƯ KÝ BAN GIÁM SÁT</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.ThuKy.HoTen}}</strong>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <strong>TRƯỞNG BAN GIÁM SÁT</strong><br>
        <span style="font-style: italic; font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <strong>{{Ban.TruongBan.HoTen}}</strong>
      </td>
    </tr>
  </table>
</div>
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
