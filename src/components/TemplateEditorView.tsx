import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  Save, 
  X, 
  Tag, 
  Sparkles 
} from 'lucide-react';
import type { FormTemplate } from '../types/schema';
import { AVAILABLE_PLACEHOLDERS } from '../services/templateEngine';
import JoditEditor from 'jodit-react';
import 'jodit/es2015/jodit.min.css';
import { renderAsync } from 'docx-preview';

interface TemplateEditorViewProps {
  templates: FormTemplate[];
  onSave: (template: FormTemplate) => void;
  onDelete: (id: string) => void;
}

export const TemplateEditorView: React.FC<TemplateEditorViewProps> = ({
  templates,
  onSave,
  onDelete
}) => {
  const [editingItem, setEditingItem] = useState<Partial<FormTemplate> | null>(null);
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const editorRef = useRef<any>(null);

  const joditConfig = useMemo(() => ({
    readonly: false,
    height: 400,
    placeholder: 'Bắt đầu soạn thảo văn bản...',
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    defaultActionOnPaste: 'insert_as_html' as any,
    defaultActionOnPasteFromWord: 'insert_as_html' as any,
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'table', 'link', 'image', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'fullsize', 'print'
    ],
    controls: {
      font: {
        list: {
          "times new roman,times,serif": "Times New Roman",
          "Arial": "Arial",
          "Courier New": "Courier New",
          "Georgia": "Georgia",
          "Tahoma": "Tahoma",
          "Verdana": "Verdana"
        }
      }
    }
  }) as any, []);

  const filteredTemplates = templates.filter(t => 
    selectedBoardFilter === 'ALL' || t.boardCode === selectedBoardFilter || t.boardCode === 'GENERAL'
  );

  const handleCreateNew = () => {
    setEditingItem({
      id: `tmpl-${Date.now()}`,
      boardCode: 'DE_THI',
      templateCode: 'MAU_MOI_01',
      title: 'Biên bản mới',
      description: 'Mô tả mục đích biên bản...',
      htmlContent: `<div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; color: #000;">
  <h2 style="text-align: center; text-transform: uppercase;">BIÊN BẢN TỔ CHỨC THI</h2>
  <p>Hôm nay, ngày {{KyThi.NgayThi}}, tại {{KyThi.DiaDiem}}.</p>
  <p>Ban thực hiện: <strong>{{Ban.Ten}}</strong></p>
  <p>Trưởng Ban: <strong>{{Ban.TruongBan.HoTen}}</strong></p>
</div>`,
      pageSize: 'A4',
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 30,
      marginRight: 15
    });
    setActiveTab('visual');
  };

  const handleInsertPlaceholder = (tag: string) => {
    if (!editingItem) return;
    if (activeTab === 'visual' && editorRef.current) {
      editorRef.current.focus();
      editorRef.current.s.insertHTML(` ${tag} `);
      setEditingItem({
        ...editingItem,
        htmlContent: editorRef.current.value
      });
    } else {
      const current = editingItem.htmlContent || '';
      setEditingItem({
        ...editingItem,
        htmlContent: current + ' ' + tag + ' '
      });
    }
  };

  const handleLoadDecree30Boilerplate = () => {
    if (!editingItem) return;
    const decree30Html = `<div style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.4; color: #000; padding: 0;">
  <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 20px;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top; font-size: 13pt;">
        <strong>HỌC VIỆN / BAN TỔ CHỨC</strong><br />
        <strong>HỘI ĐỒNG THI TỐT NGHIỆP</strong><br />
        <span style="display: block; width: 60px; height: 1px; background: #000; margin: 5px auto 0 auto;"></span>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top; font-size: 13pt;">
        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br />
        <strong><u>Độc lập - Tự do - Hạnh phúc</u></strong><br />
        <em style="font-size: 12pt; display: block; margin-top: 5px;">..., ngày {{KyThi.NgayThi}}</em>
      </td>
    </tr>
  </table>

  <h3 style="text-align: center; font-size: 16pt; margin: 25px 0 15px 0; font-weight: bold; text-transform: uppercase;">
    BIÊN BẢN VỀ VIỆC {{Ban.Ten}}
  </h3>
  <p style="text-align: center; font-style: italic; margin-bottom: 20px;">(Kỳ thi: {{KyThi.TenKyThi}} - Khóa: {{KyThi.KhoaThi}})</p>

  <p style="text-indent: 30px; margin-bottom: 10px;">
    Hôm nay, vào hồi ..... giờ ..... ngày {{KyThi.NgayThi}}, tại địa điểm {{KyThi.DiaDiem}}, 
    <strong>{{Ban.Ten}}</strong> đã tiến hành họp và làm việc theo đúng quy định hành chính.
  </p>

  <p style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">I. THÀNH PHẦN THAM GIA BIÊN BẢN:</p>
  {{Bang.DanhSachThanhVien}}

  <p style="font-weight: bold; margin-top: 15px; margin-bottom: 5px;">II. NỘI DUNG LÀM VIỆC & KẾT QUẢ:</p>
  <p style="text-indent: 30px;">1. Tổng số cán bộ có mặt: {{ThongKe.TongSoThanhVien}} đồng chí.</p>
  <p style="text-indent: 30px;">2. Nội dung chi tiết: ..........................................................................................................................................</p>

  <table style="width: 100%; border-collapse: collapse; border: none; margin-top: 40px; page-break-inside: avoid;">
    <tr>
      <td style="width: 50%; text-align: center; vertical-align: top; font-size: 13pt;">
        <strong>THƯ KÝ BAN</strong><br />
        <em style="font-size: 11pt;">(Ký và ghi rõ họ tên)</em><br /><br /><br /><br />
        <strong>{{Ban.ThuKy.HoTen}}</strong>
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top; font-size: 13pt;">
        <strong>TRƯỞNG BAN</strong><br />
        <em style="font-size: 11pt;">(Ký và ghi rõ họ tên)</em><br /><br /><br /><br />
        <strong>{{Ban.TruongBan.HoTen}}</strong>
      </td>
    </tr>
  </table>
</div>`;

    setEditingItem({
      ...editingItem,
      htmlContent: decree30Html,
      pageSize: 'A4',
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 30,
      marginRight: 15
    });
    setActiveTab('visual');
  };

  const handleImportDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const tempDiv = document.createElement('div');
      
      await renderAsync(arrayBuffer, tempDiv, undefined, {
        className: 'docx',
        inWrapper: false,
        ignoreWidth: true,
        ignoreHeight: true,
      });

      if (editingItem) {
        setEditingItem({
          ...editingItem,
          htmlContent: tempDiv.innerHTML
        });
        setActiveTab('visual');
      }
      
      e.target.value = '';
    } catch (err: any) {
      alert('Lỗi khi phân tích và nhập file Word: ' + err.message);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.htmlContent) {
      alert('Vui lòng điền Tiêu đề và Nội dung biên bản');
      return;
    }
    const saved: FormTemplate = {
      id: editingItem.id || `tmpl-${Date.now()}`,
      boardCode: editingItem.boardCode || 'DE_THI',
      templateCode: editingItem.templateCode?.toUpperCase() || `MAU_${Date.now()}`,
      title: editingItem.title.trim(),
      description: editingItem.description || '',
      htmlContent: editingItem.htmlContent,
      createdAt: editingItem.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pageSize: editingItem.pageSize || 'A4',
      marginTop: Number(editingItem.marginTop ?? 20),
      marginBottom: Number(editingItem.marginBottom ?? 20),
      marginLeft: Number(editingItem.marginLeft ?? 30),
      marginRight: Number(editingItem.marginRight ?? 15)
    };
    onSave(saved);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Thư Viện & Trình Biên Soạn Mẫu Biểu Mẫu
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý các mẫu biên bản (Biên bản tổ hợp đề, Biên bản giao nhận, Biên bản dồn phách...) và chèn thẻ giữ chỗ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBoardFilter}
            onChange={(e) => setSelectedBoardFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Tất cả các Ban</option>
            <option value="DE_THI">Ban Đề thi</option>
            <option value="COI_THI">Ban Coi thi</option>
            <option value="PHACH">Ban Phách</option>
            <option value="CHAM_THI">Ban Chấm thi</option>
            <option value="GIAM_SAT">Ban Giám sát</option>
          </select>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Tạo Mẫu Mới
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              {editingItem.createdAt ? 'Chỉnh Sửa Biểu Mẫu' : 'Biên Soạn Mẫu Mới'}
            </h3>

            <div className="flex items-center gap-3">
              {/* Tải mẫu Nghị định 30 */}
              <button
                type="button"
                onClick={handleLoadDecree30Boilerplate}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-sm"
                title="Tải cấu trúc mẫu biểu hành chính Việt Nam chuẩn Nghị định 30/2020/NĐ-CP"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mẫu Chuẩn NĐ 30</span>
              </button>

              {/* Nhập từ Word */}
              <label className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer transition select-none shadow-sm">
                <FileText className="w-3.5 h-3.5" />
                <span>Nhập từ Word (.docx)</span>
                <input
                  type="file"
                  accept=".docx"
                  className="hidden"
                  onChange={handleImportDocx}
                />
              </label>

              <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className={`px-3 py-1 rounded-md transition ${activeTab === 'visual' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-600'}`}
                >
                  Soạn Thảo Trực Quan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1 rounded-md transition ${activeTab === 'code' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-600'}`}
                >
                  Soạn Thảo HTML
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md transition ${activeTab === 'preview' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-600'}`}
                >
                  Xem Trước
                </button>
              </div>

              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thuộc Ban Chuyên Trách (*)</label>
                <select
                  value={editingItem.boardCode || 'DE_THI'}
                  onChange={(e) => setEditingItem({ ...editingItem, boardCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DE_THI">Ban Đề thi</option>
                  <option value="COI_THI">Ban Coi thi</option>
                  <option value="PHACH">Ban Phách</option>
                  <option value="CHAM_THI">Ban Chấm thi</option>
                  <option value="GIAM_SAT">Ban Giám sát</option>
                  <option value="GENERAL">Chung toàn kỳ thi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Ký Hiệu Mẫu (*)</label>
                <input
                  type="text"
                  placeholder="VD: DE_THI_01"
                  value={editingItem.templateCode || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, templateCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Biểu Mẫu / Biên Bản (*)</label>
                <input
                  type="text"
                  placeholder="VD: Biên bản giao nhận bài thi..."
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Page Setup Configuration */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khổ Giấy</label>
                <select
                  value={editingItem.pageSize || 'A4'}
                  onChange={(e) => setEditingItem({ ...editingItem, pageSize: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="A5">A5 (148 x 210 mm)</option>
                  <option value="Letter">Letter (216 x 279 mm)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lề Trên (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingItem.marginTop ?? 20}
                  onChange={(e) => setEditingItem({ ...editingItem, marginTop: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lề Dưới (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingItem.marginBottom ?? 20}
                  onChange={(e) => setEditingItem({ ...editingItem, marginBottom: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lề Trái (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingItem.marginLeft ?? 30}
                  onChange={(e) => setEditingItem({ ...editingItem, marginLeft: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lề Phải (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingItem.marginRight ?? 15}
                  onChange={(e) => setEditingItem({ ...editingItem, marginRight: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Split Screen: Editor with Variable Injector */}
            {activeTab === 'visual' || activeTab === 'code' ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Left: Editor (Visual or Raw HTML) */}
                {activeTab === 'visual' ? (
                  <div className="md:col-span-3 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Soạn Thảo Trực Quan (Hỗ trợ copy/paste từ Word)</label>
                    <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex justify-center overflow-x-auto min-h-[500px]">
                      <div 
                        className="bg-white shadow-xl border-2 border-dashed border-slate-400 rounded-sm w-full transition-all duration-300 overflow-hidden"
                        style={{
                          maxWidth: editingItem.pageSize === 'A5' ? '148mm' : editingItem.pageSize === 'Letter' ? '216mm' : '210mm',
                          paddingTop: `${editingItem.marginTop ?? 20}mm`,
                          paddingBottom: `${editingItem.marginBottom ?? 20}mm`,
                          paddingLeft: `${editingItem.marginLeft ?? 30}mm`,
                          paddingRight: `${editingItem.marginRight ?? 15}mm`,
                        }}
                      >
                        <JoditEditor
                          ref={editorRef}
                          value={editingItem.htmlContent || ''}
                          config={joditConfig}
                          onBlur={(newContent) => {
                            setEditingItem(prev => prev ? { ...prev, htmlContent: newContent } : null);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-3 space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Nội Dung Văn Bản HTML (*)</label>
                    <textarea
                      rows={16}
                      value={editingItem.htmlContent || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, htmlContent: e.target.value })}
                      className="w-full font-mono text-xs bg-slate-900 text-emerald-400 p-4 rounded-xl outline-none border border-slate-800 leading-relaxed focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Right: Placeholders Injector Panel */}
                <div className="md:col-span-1 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3 max-h-[440px] overflow-y-auto">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" /> Click để chèn Thẻ
                  </label>

                  {['Kỳ thi', 'Ban & Thành viên', 'Bảng tự động'].map((cat) => {
                    const group = AVAILABLE_PLACEHOLDERS.filter(p => p.category === cat);
                    return (
                      <div key={cat} className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{cat}</span>
                        <div className="space-y-1">
                          {group.map(p => (
                            <button
                              key={p.tag}
                              type="button"
                              onClick={() => handleInsertPlaceholder(p.tag)}
                              className="w-full text-left bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded p-1.5 text-xs transition group"
                            >
                              <div className="font-mono text-[11px] text-indigo-600 group-hover:text-indigo-700 font-bold">
                                {p.tag}
                              </div>
                              <div className="text-[10px] text-slate-500">{p.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Live Preview tab */
              <div className="bg-slate-100 p-6 rounded-xl border border-slate-300 max-h-[500px] overflow-y-auto flex justify-center">
                <div 
                  className="bg-white shadow-lg border border-slate-300 rounded-sm w-full transition-all duration-300 font-serif text-slate-900"
                  style={{
                    maxWidth: editingItem.pageSize === 'A5' ? '148mm' : editingItem.pageSize === 'Letter' ? '216mm' : '210mm',
                    minHeight: editingItem.pageSize === 'A5' ? '210mm' : editingItem.pageSize === 'Letter' ? '279mm' : '297mm',
                    paddingTop: `${editingItem.marginTop ?? 20}mm`,
                    paddingBottom: `${editingItem.marginBottom ?? 20}mm`,
                    paddingLeft: `${editingItem.marginLeft ?? 30}mm`,
                    paddingRight: `${editingItem.marginRight ?? 15}mm`,
                  }}
                  dangerouslySetInnerHTML={{ __html: editingItem.htmlContent || '' }}
                />
              </div>
            )}

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
                <Save className="w-4 h-4" /> Lưu Biểu Mẫu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(tmpl => (
          <div key={tmpl.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 transition space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {tmpl.boardCode}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {tmpl.templateCode}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mt-2">{tmpl.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description || 'Chưa có mô tả'}</p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-mono">
                {new Date(tmpl.updatedAt).toLocaleDateString('vi-VN')}
              </span>

              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingItem({
                      pageSize: 'A4',
                      marginTop: 20,
                      marginBottom: 20,
                      marginLeft: 30,
                      marginRight: 15,
                      ...tmpl
                    });
                    setActiveTab('visual');
                  }}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  title="Sửa mẫu"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Xác nhận xóa mẫu "${tmpl.title}"?`)) onDelete(tmpl.id);
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
