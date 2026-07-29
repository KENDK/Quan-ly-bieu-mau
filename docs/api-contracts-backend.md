# REST API Contracts and Endpoints

This document outlines the API endpoints exposed by the Python/Django REST Framework backend (`qlbm_backend` container on port `8000`). All endpoints return and accept JSON data payloads.

---

## Base URL
When running locally via Docker Compose, the API base path is:
*   Internal container access: `http://backend:8000/api`
*   Frontend Nginx proxy: `/api` (proxies requests to Gunicorn)

---

## Endpoints Specification

### 1. Training Types (`/api/training-types/`)
Manages training types configuration.

*   `GET /api/training-types/`
    *   Returns array of all training types.
    *   Response format:
        ```json
        [
          {
            "id": "dai-hoc",
            "code": "DH",
            "name": "Đại học Quân sự",
            "description": "Hệ đào tạo Đại học chính quy",
            "createdAt": "2026-07-29T12:00:00Z"
          }
        ]
        ```
*   `POST /api/training-types/`
    *   Creates a new training type.
*   `PUT /api/training-types/{id}/`
    *   Updates training type.
*   `DELETE /api/training-types/{id}/`
    *   Removes training type.

---

### 2. Personnel (`/api/personnel/`)
Manages personnel/officers list.

*   `GET /api/personnel/`
    *   Returns list of all personnel.
    *   Response format:
        ```json
        [
          {
            "id": "p-12345",
            "fullName": "Nguyễn Văn An",
            "academicTitle": "TS",
            "department": "Khoa Công nghệ thông tin",
            "position": "Trưởng bộ môn",
            "phone": "0912345678",
            "email": "an.nv@university.edu.vn",
            "militaryRank": "Trung tá",
            "createdAt": "2026-07-29T12:00:00Z"
          }
        ]
        ```
*   `POST /api/personnel/`
    *   Creates a new officer profile.
*   `PUT /api/personnel/{id}/`
    *   Updates officer profile.
*   `DELETE /api/personnel/{id}/`
    *   Removes officer profile.

---

### 3. Exams (`/api/exams/`)
Manages graduation exams.

*   `GET /api/exams/`
    *   Returns list of graduation exams.
    *   Response format:
        ```json
        [
          {
            "id": "exam-2026",
            "code": "KTTN-2026",
            "name": "Kỳ thi tốt nghiệp khóa 2026",
            "training_type": "dai-hoc",
            "cohort": "Khóa 51 - Kỹ sư quân sự",
            "examDate": "2026-08-15",
            "location": "Khu A - Giảng đường trung tâm",
            "totalSubjects": 3,
            "totalRooms": 10,
            "studentsPerRoom": 25,
            "subjectsList": ["Toán chuyên ngành", "Cơ sở dữ liệu", "Hệ điều hành"],
            "status": "planning",
            "createdAt": "2026-07-29T12:00:00Z"
          }
        ]
        ```
*   `POST /api/exams/`
    *   Creates a new graduation exam.
*   `PUT /api/exams/{id}/`
    *   Updates graduation exam details.
*   `DELETE /api/exams/{id}/`
    *   Removes graduation exam.

---

### 4. Exam Boards (`/api/boards/`)
Manages boards assigned to an exam.

*   `GET /api/boards/`
    *   Returns boards. Can filter by exam via query param `?examId={id}`.
    *   Response format:
        ```json
        [
          {
            "id": "board-de-thi",
            "exam": "exam-2026",
            "boardCode": "DE_THI",
            "boardName": "Ban Đề thi",
            "description": "Chịu trách nhiệm ra đề, in ấn và bảo mật đề thi",
            "createdAt": "2026-07-29T12:00:00Z"
          }
        ]
        ```
*   `POST /api/boards/`
    *   Creates a new board under an exam.
*   `PUT /api/boards/{id}/`
    *   Updates board configuration.
*   `DELETE /api/boards/{id}/`
    *   Removes board.

---

### 5. Board Member Assignments (`/api/assignments/`)
Manages staff allocations within exam boards.

*   `GET /api/assignments/`
    *   Returns assignments. Can filter by board via query param `?examBoardId={id}`.
    *   Response format:
        ```json
        [
          {
            "id": "asgn-1",
            "exam_board": "board-de-thi",
            "personnel": "p-12345",
            "roleName": "Trưởng ban",
            "assignedSubject": "An toàn thông tin",
            "notes": "Phụ trách giám sát ra đề"
          }
        ]
        ```
*   `POST /api/assignments/`
    *   Creates a new assignment.
*   `PUT /api/assignments/{id}/`
    *   Updates assignment details.
*   `DELETE /api/assignments/{id}/`
    *   Removes assignment.

---

### 6. Form Templates (`/api/templates/`)
Manages document layout and HTML templates.

*   `GET /api/templates/`
    *   Returns templates.
    *   Response format:
        ```json
        [
          {
            "id": "tpl-quyet-dinh",
            "boardCode": "DE_THI",
            "templateCode": "QD_THANH_LAP_BAN",
            "title": "Quyết định thành lập Ban đề thi tốt nghiệp",
            "description": "Mẫu quyết định chung thành lập ban đề thi",
            "htmlContent": "<html><body>...</body></html>",
            "pageSize": "A4",
            "marginTop": 20,
            "marginBottom": 20,
            "marginLeft": 30,
            "marginRight": 15,
            "createdAt": "2026-07-29T12:00:00Z",
            "updatedAt": "2026-07-29T12:00:00Z"
          }
        ]
        ```
*   `POST /api/templates/`
    *   Creates a new HTML template.
*   `PUT /api/templates/{id}/`
    *   Updates template properties or HTML code.
*   `DELETE /api/templates/{id}/`
    *   Removes template.
