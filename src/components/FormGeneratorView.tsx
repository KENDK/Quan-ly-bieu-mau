import React, { useState } from 'react';
import { 
  FileCheck, 
  Printer, 
  Download, 
  Layers, 
  FileText, 
  Archive
} from 'lucide-react';
import type { Exam, ExamBoard, FormTemplate } from '../types/schema';
import { renderTemplateHtml } from '../services/templateEngine';
import { exportSingleFormToDoc, exportBoardFormsToZip, exportAllExamFormsToZip } from '../services/bulkExporter';

interface FormGeneratorViewProps {
  activeExam: Exam | undefined;
  boards: ExamBoard[];
  templates: FormTemplate[];
}

export const FormGeneratorView: React.FC<FormGeneratorViewProps> = ({
  activeExam,
  boards,
  templates
}) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>(boards[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  if (!activeExam) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-200">
        <p className="text-slate-500">Vui lòng chọn một Kỳ thi để sinh biểu mẫu tự động.</p>
      </div>
    );
  }

  const activeBoard = boards.find(b => b.id === selectedBoardId) || boards[0];
  const boardTemplates = activeBoard ? templates.filter(t => t.boardCode === activeBoard.boardCode || t.boardCode === 'GENERAL') : [];
  
  const currentTemplate = boardTemplates.find(t => t.id === selectedTemplateId) || boardTemplates[0];

  // Render current template in real-time
  const renderedHtml = currentTemplate ? renderTemplateHtml(currentTemplate.htmlContent, activeExam, activeBoard) : '';

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const pageSize = currentTemplate?.pageSize || 'A4';
    const margins = {
      top: currentTemplate?.marginTop ?? 20,
      bottom: currentTemplate?.marginBottom ?? 20,
      left: currentTemplate?.marginLeft ?? 30,
      right: currentTemplate?.marginRight ?? 15
    };
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentTemplate?.title || 'Biên bản kỳ thi'}</title>
          <style>
            @page {
              size: ${pageSize === 'Letter' ? 'letter' : pageSize === 'A5' ? 'A5' : 'A4'};
              margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
            }
            body {
              font-family: 'Times New Roman', serif;
              font-size: 14pt;
              line-height: 1.5;
              color: #000;
              margin: 0;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
          </style>
        </head>
        <body>
          ${renderedHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleExportSingleWord = () => {
    if (!currentTemplate) return;
    const pageSize = currentTemplate.pageSize || 'A4';
    const margins = {
      top: currentTemplate.marginTop ?? 20,
      bottom: currentTemplate.marginBottom ?? 20,
      left: currentTemplate.marginLeft ?? 30,
      right: currentTemplate.marginRight ?? 15
    };
    exportSingleFormToDoc(currentTemplate.title, currentTemplate.htmlContent, activeExam, activeBoard, pageSize, margins);
  };

  const handleExportCurrentBoardZip = async () => {
    if (!activeBoard) return;
    try {
      await exportBoardFormsToZip(activeExam, activeBoard);
    } catch (err: any) {
      alert(err.message || 'Lỗi xuất file');
    }
  };

  const handleExportAllZip = async () => {
    try {
      await exportAllExamFormsToZip(activeExam);
    } catch (err: any) {
      alert(err.message || 'Lỗi xuất file');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {activeExam.code} - {activeExam.cohort}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-600" />
            Tự Động Tạo & Xuất Biểu Mẫu Kỳ Thi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Engine mapping tự động dữ liệu Kỳ thi & Ban vào biểu mẫu, hỗ trợ In trực tiếp, Xuất Word và **Xuất đồng loạt ZIP**
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportAllZip}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition"
            title="Xuất nén tất cả biểu mẫu của tất cả các Ban trong kỳ thi này"
          >
            <Archive className="w-4 h-4" />
            <span>Xuất 1-Click Toàn Kỳ Thi (ZIP)</span>
          </button>

          {activeBoard && (
            <button
              onClick={handleExportCurrentBoardZip}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition"
              title="Xuất nén tất cả mẫu của Ban hiện tại"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Nén {activeBoard.boardCode} (ZIP)</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs px-3 py-2.5 rounded-xl transition"
          >
            <Printer className="w-4 h-4" /> In A4
          </button>

          <button
            onClick={handleExportSingleWord}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition"
          >
            <FileText className="w-4 h-4" /> Tải Word (.docx)
          </button>
        </div>
      </div>

      {/* Main Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar: Select Board & Template */}
        <div className="md:col-span-1 space-y-5">
          {/* Step 1: Select Board */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" /> 1. Chọn Ban Chuyên Trách
            </label>

            <div className="space-y-1.5">
              {boards.map(b => {
                const isSelected = b.id === (activeBoard?.id || '');
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBoardId(b.id);
                      setSelectedTemplateId('');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span>{b.boardName}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {b.boardCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Form Template */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" /> 2. Chọn Biểu Mẫu ({boardTemplates.length})
            </label>

            <div className="space-y-1.5">
              {boardTemplates.length > 0 ? (
                boardTemplates.map(tmpl => {
                  const isSelected = tmpl.id === (currentTemplate?.id || '');
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-800">{tmpl.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tmpl.templateCode}</div>
                    </button>
                  );
                })
              ) : (
                <div className="text-xs text-slate-400 italic py-2">
                  Chưa có biểu mẫu nào cho Ban này.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Main Area: Live A4 Interactive Document Preview */}
        <div className="md:col-span-3">
          <div className="bg-slate-200/80 p-6 rounded-2xl border border-slate-300 min-h-[600px] overflow-x-auto flex justify-center">
            {currentTemplate ? (
              <div 
                className="bg-white shadow-2xl rounded-sm border border-slate-300 font-serif text-slate-900 leading-relaxed transition transform w-full"
                style={{
                  maxWidth: currentTemplate.pageSize === 'A5' ? '148mm' : currentTemplate.pageSize === 'Letter' ? '216mm' : '210mm',
                  minHeight: currentTemplate.pageSize === 'A5' ? '210mm' : currentTemplate.pageSize === 'Letter' ? '279mm' : '297mm',
                  paddingTop: `${currentTemplate.marginTop ?? 20}mm`,
                  paddingBottom: `${currentTemplate.marginBottom ?? 20}mm`,
                  paddingLeft: `${currentTemplate.marginLeft ?? 30}mm`,
                  paddingRight: `${currentTemplate.marginRight ?? 15}mm`,
                }}
              >
                {/* Dynamically Rendered HTML */}
                <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Vui lòng chọn biểu mẫu ở bên trái để xem trước bản in A4.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
