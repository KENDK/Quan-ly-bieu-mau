# Project Overview

The **Graduation Exam Form Management** (Quản lý biểu mẫu kỳ thi tốt nghiệp) is a web application designed to automate the configuration and compilation of legal/administrative forms required for national graduation exam boards.

---

## Business Purpose

During the setup of university graduation exams, administrative officers must compile dozens of regulatory forms (decision letters, room supervisor allocations, exam security sign-off sheets, supervisor lists). Doing this manually in Microsoft Word is error-prone and time-consuming.

This system provides:
1.  **Metadata configuration**: Define training types, graduation exams, subjects list, rooms, and candidate limits.
2.  **Personnel registry**: Maintain a list of lecturers, academic positions, and military ranks.
3.  **Exam board setups**: Set up custom committees (e.g. Ban Đề thi, Ban Coi thi) and assign officers to specialized roles (Trưởng ban, Phó trưởng ban, Thư ký).
4.  **WYSIWYG Word Editor**: Customize Word document templates directly in the browser using placeholder tokens.
5.  **Dynamic Generation**: Compile and export Word files (.doc/.zip) with real-time exam board data.
6.  **Excel Import/Export**: Batch import/export personnel lists and graduation exams directly via Excel.

---

## Tech Stack Overview

| Tier | Component | Technology | Version |
| :--- | :--- | :--- | :--- |
| **Frontend** | Build Tool | Vite | `v5.x` |
| | Core Framework | React | `v18.3` |
| | Language | TypeScript | `v5.x` |
| | Rich Text Editor | Jodit Editor | `v4.x` |
| **Backend** | API Engine | Django REST Framework | `v3.14` |
| | Core Platform | Django | `v4.2` |
| | Language | Python | `v3.11` |
| **Database** | Database Engine| PostgreSQL | `v15` |
| **Deployment** | Web Server | Nginx | `latest` |
| | App Server | Gunicorn | `latest` |
| | Containers | Docker & Docker Compose | `latest` |
