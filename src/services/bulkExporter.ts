import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Exam, ExamBoard } from '../types/schema';
import { storage } from './storage';
import { renderTemplateHtml } from './templateEngine';

// Helper to convert HTML string to Word-compatible HTML Document (.doc / .docx)
export function wrapHtmlForDocx(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForCustomXSL/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page WordSection1 {
      size: 210mm 297mm; /* A4 */
      margin: 20mm 15mm 20mm 30mm; /* Vietnamese Standard Margins */
    }
    div.WordSection1 {
      page: WordSection1;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 14pt;
      line-height: 1.4;
      color: #000;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      font-family: 'Times New Roman', serif;
    }
  </style>
</head>
<body>
  <div class="WordSection1">
    ${bodyHtml}
  </div>
</body>
</html>`;
}

// Download a single document as Word (.doc) file
export function exportSingleFormToDoc(title: string, htmlContent: string, exam: Exam, board?: ExamBoard): void {
  const rendered = renderTemplateHtml(htmlContent, exam, board);
  const fullDocHtml = wrapHtmlForDocx(title, rendered);
  const blob = new Blob(['\ufeff' + fullDocHtml], { type: 'application/msword;charset=utf-8' });
  const safeTitle = title.replace(/[^a-zA-Z0-9_ -]/g, '_');
  saveAs(blob, `${safeTitle}.doc`);
}

// Bulk Export for a single board
export async function exportBoardFormsToZip(exam: Exam, board: ExamBoard): Promise<void> {
  const zip = new JSZip();
  const templates = storage.getTemplates(board.boardCode);
  
  if (templates.length === 0) {
    throw new Error(`Không tìm thấy biểu mẫu nào cho ${board.boardName}`);
  }

  const folderName = `${board.boardCode}_${board.boardName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const folder = zip.folder(folderName);

  templates.forEach((tmpl, idx) => {
    const rendered = renderTemplateHtml(tmpl.htmlContent, exam, board);
    const docHtml = wrapHtmlForDocx(tmpl.title, rendered);
    const safeTitle = `${idx + 1}_${tmpl.title.replace(/[^a-zA-Z0-9_ -]/g, '_')}.doc`;
    folder?.file(safeTitle, '\ufeff' + docHtml);
  });

  const zipContent = await zip.generateAsync({ type: 'blob' });
  const safeExamName = exam.code || 'KyThi';
  saveAs(zipContent, `BiieuMau_${board.boardCode}_${safeExamName}.zip`);
}

// Bulk Export ALL boards for an exam (1-Click Export)
export async function exportAllExamFormsToZip(exam: Exam): Promise<void> {
  const zip = new JSZip();
  const boards = storage.getBoards(exam.id);

  if (boards.length === 0) {
    throw new Error('Kỳ thi chưa thiết lập các Ban chuyên trách');
  }

  let totalFiles = 0;

  for (let i = 0; i < boards.length; i++) {
    const board = boards[i];
    const templates = storage.getTemplates(board.boardCode);

    if (templates.length > 0) {
      const folderName = `${String(i + 1).padStart(2, '0')}_${board.boardName.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const folder = zip.folder(folderName);

      templates.forEach((tmpl, idx) => {
        const rendered = renderTemplateHtml(tmpl.htmlContent, exam, board);
        const docHtml = wrapHtmlForDocx(tmpl.title, rendered);
        const safeTitle = `${String(idx + 1).padStart(2, '0')}_${tmpl.title.replace(/[^a-zA-Z0-9_ -]/g, '_')}.doc`;
        folder?.file(safeTitle, '\ufeff' + docHtml);
        totalFiles++;
      });
    }
  }

  if (totalFiles === 0) {
    throw new Error('Không tìm thấy biểu mẫu nào trong thư viện!');
  }

  const zipContent = await zip.generateAsync({ type: 'blob' });
  const safeExamName = (exam.name || exam.code).replace(/[^a-zA-Z0-9_ -]/g, '_');
  saveAs(zipContent, `TOAN_BO_BIEU_MAU_${safeExamName}.zip`);
}
