import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Save, X, Search, Phone, Mail, Building, Download, FileSpreadsheet } from 'lucide-react';
import type { Personnel } from '../types/schema';
import * as XLSX from 'xlsx';

interface PersonnelViewProps {
  personnel: Personnel[];
  onSave: (item: Personnel) => void;
  onDelete: (id: string) => void;
}

export const PersonnelView: React.FC<PersonnelViewProps> = ({
  personnel,
  onSave,
  onDelete
}) => {
  const [editingItem, setEditingItem] = useState<Partial<Personnel> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDownloadTemplate = () => {
    const headers = [
      'Họ và Tên',
      'Học vị / Học hàm',
      'Đơn vị / Khoa phòng',
      'Chức vụ',
      'Số điện thoại',
      'Email'
    ];
    const data = [
      headers,
      ['Nguyễn Văn A', 'TS.', 'Khoa Công nghệ thông tin', 'Trưởng bộ môn', '0912345678', 'nva@university.edu.vn'],
      ['Trần Thị B', 'PGS.TS.', 'Khoa Lý luận chính trị', 'Phó Trưởng khoa', '0987654321', 'ttb@university.edu.vn'],
      ['Lê Văn C', 'ThS.', 'Phòng Đào tạo', 'Chuyên viên', '', 'lvc@university.edu.vn']
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mau_Import_Can_Bo');
    XLSX.writeFile(wb, 'Mau_Import_Can_Bo.xlsx');
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

      if (rows.length <= 1) {
        alert('File excel không chứa dữ liệu hoặc sai định dạng');
        return;
      }

      let importCount = 0;
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0 || !row[0]) continue;

        const fullName = String(row[0]).trim();
        const academicTitle = String(row[1] || 'CN').trim();
        const department = String(row[2]).trim();
        const position = String(row[3] || '').trim();
        const phone = String(row[4] || '').trim();
        const email = String(row[5] || '').trim();

        if (!fullName || !department) continue;

        const newPersonnel: Personnel = {
          id: `p-${Date.now()}-${i}`,
          fullName,
          academicTitle,
          department,
          position,
          phone,
          email,
          createdAt: new Date().toISOString()
        };

        onSave(newPersonnel);
        importCount++;
      }

      alert(`Đã nhập thành công ${importCount} cán bộ từ file Excel!`);
      e.target.value = '';
    } catch (err: any) {
      alert('Lỗi khi đọc file Excel: ' + err.message);
    }
  };

  const handleExportExcel = () => {
    const headers = [
      'STT',
      'Họ và Tên',
      'Học vị / Học hàm',
      'Đơn vị / Khoa phòng',
      'Chức vụ',
      'Số điện thoại',
      'Email',
      'Ngày tạo'
    ];
    const rows = personnel.map((p, i) => [
      i + 1,
      p.fullName,
      p.academicTitle,
      p.department,
      p.position,
      p.phone || '',
      p.email || '',
      new Date(p.createdAt).toLocaleDateString('vi-VN')
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh_Sach_Can_Bo');
    XLSX.writeFile(wb, 'Danh_Sach_Can_Bo.xlsx');
  };

  const handleCreateNew = () => {
    setEditingItem({
      id: `p-${Date.now()}`,
      fullName: '',
      academicTitle: 'TS',
      department: '',
      position: '',
      phone: '',
      email: ''
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.fullName || !editingItem?.department) {
      alert('Vui lòng điền Họ tên và Đơn vị công tác');
      return;
    }
    onSave({
      id: editingItem.id || `p-${Date.now()}`,
      fullName: editingItem.fullName.trim(),
      academicTitle: editingItem.academicTitle || 'TS',
      department: editingItem.department.trim(),
      position: editingItem.position || '',
      phone: editingItem.phone || '',
      email: editingItem.email || '',
      createdAt: editingItem.createdAt || new Date().toISOString()
    });
    setEditingItem(null);
  };

  const filteredPersonnel = personnel.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Quản Lý Nhân Sự & Cán Bộ Giảng Viên
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách nhân sự được phân công vào các Ban kỳ thi (Họ tên, Học hàm/Học vị, Chức vụ...)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm cán bộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Tải File Excel Mẫu */}
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl transition shadow-sm"
              title="Tải File Excel Mẫu"
            >
              <Download className="w-4 h-4 text-slate-500" /> Tải Mẫu
            </button>

            {/* Nhập từ Excel */}
            <label className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-2.5 rounded-xl cursor-pointer transition shadow-sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Nhập Excel</span>
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleImportExcel}
              />
            </label>

            {/* Xuất Excel */}
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-2.5 rounded-xl transition shadow-sm"
              title="Xuất Danh Sách Cán Bộ"
            >
              <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
            </button>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Thêm Cán Bộ
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Form Edit */}
      {editingItem && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-base">
              {editingItem.createdAt ? 'Cập Nhật Hồ Sơ Cán Bộ' : 'Thêm Cán Bộ Mới'}
            </h3>
            <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Học Hàm / Học Vị (*)</label>
                <select
                  value={editingItem.academicTitle || 'TS'}
                  onChange={(e) => setEditingItem({ ...editingItem, academicTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="GS.TS">GS.TS</option>
                  <option value="PGS.TS">PGS.TS</option>
                  <option value="TS">TS</option>
                  <option value="ThS">ThS</option>
                  <option value="CN">CN</option>
                  <option value="BS">BS</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ Và Tên Cán Bộ (*)</label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn An..."
                  value={editingItem.fullName || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn Vị Công Tác (*)</label>
                <input
                  type="text"
                  placeholder="VD: Khoa Xây dựng Đảng / Phòng Đào tạo..."
                  value={editingItem.department || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chức Vụ Chính Quyền</label>
                <input
                  type="text"
                  placeholder="VD: Trưởng khoa / Phó Trưởng phòng / Giảng viên..."
                  value={editingItem.position || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Điện Thoại</label>
                <input
                  type="text"
                  placeholder="VD: 0912345678"
                  value={editingItem.phone || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Liên Hệ</label>
                <input
                  type="email"
                  placeholder="VD: nvan@edu.vn"
                  value={editingItem.email || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                <Save className="w-4 h-4" /> Lưu Hồ Sơ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Personnel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPersonnel.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 transition space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {p.academicTitle}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{p.fullName}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingItem(p)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Xác nhận xóa cán bộ "${p.fullName}"?`)) onDelete(p.id);
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{p.department}</span> {p.position && `(${p.position})`}
              </div>
              {p.phone && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.phone}</span>
                </div>
              )}
              {p.email && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.email}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
