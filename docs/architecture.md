# System Architecture Specification

This document details the software architecture, design invariants, and implementation patterns of the Graduation Exam Form Management system.

---

## High-Level Component Design

The system is designed as a three-tier architecture deployed in containerized environments:

1.  **Frontend Layer (React/Vite)**: A Single Page Application (SPA) compiled with TypeScript. It renders views, manages state, and triggers document rendering and Excel parsing.
2.  **API Backend Layer (Django/Gunicorn)**: A RESTful API built with Python. It handles database persistence, object relations, and CRUD processing.
3.  **Database Layer (PostgreSQL)**: Persists tables, relations, and JSONB columns.

```mermaid
graph TD
    subgraph Host ["Host System (Local Machine)"]
        Browser["Web Browser (client)"]
        ExcelFiles["Excel Sheets (Import/Export)"]
        WordDocs["Word Downloads (.doc/.zip)"]
    end

    subgraph DockerCompose ["Docker Compose Orchestration"]
        NginxContainer["Nginx Container (qlbm_frontend)"]
        DjangoContainer["Django Backend Container (qlbm_backend)"]
        PostgresContainer["PostgreSQL Container (qlbm_db)"]
    end

    Browser -->|Port 8090 (HTTP)| NginxContainer
    Browser <-->|Excel Files| ExcelFiles
    Browser <-->|Word Files| WordDocs

    NginxContainer -->|Static Files Route| Browser
    NginxContainer -->|Proxy Route /api/*| DjangoContainer
    NginxContainer -->|Proxy Route /qlbm-admin/*| DjangoContainer

    DjangoContainer -->|Postgres Protocol| PostgresContainer
```

---

## Layer-by-Layer Architecture

### 1. Frontend Architecture
*   **Module Bundler**: Vite (for rapid hot-reload and optimized production assets compilation).
*   **State Management**: Centralized reactive state in [App.tsx](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/App.tsx). State update flows:
    1.  Components trigger callbacks (`onSave`, `onDelete`).
    2.  [App.tsx](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/App.tsx) handles the callback and commits the change to [storage.ts](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/services/storage.ts).
    3.  [storage.ts](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/services/storage.ts) updates in-memory arrays and dispatches an asynchronous HTTP request (POST/PUT/DELETE) to the backend.
    4.  [App.tsx](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/App.tsx) re-fetches cached arrays synchronously from [storage.ts](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/services/storage.ts) memory to trigger React UI re-rendering instantly.
*   **Document Parsing Layer**: Uses `docx-preview` on browser side to parse Microsoft Word XML buffers and output formatted HTML into the Jodit React Editor.
*   **Template Rendering Engine**: Custom logic in [templateEngine.ts](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/services/templateEngine.ts) compiles placeholders like `{{KyThi.NgayThi}}` into corresponding text values.

### 2. Backend API Architecture
*   **Framework**: Django REST Framework (DRF) mapped onto PostgreSQL database.
*   **Serialization**: Automatic field serialization mapping Django DB models to API outputs. Django model fields are written in camelCase (matching TypeScript interface keys) with `db_column` properties mapping them to standard snake_case database fields.
*   **CORS Configuration**: Django is set up with `django-cors-headers` to allow requests originating from dev servers (e.g. `http://localhost:5173`) in local runs.

### 3. Database Schema Design Invariants
*   **Foreign Keys**: Explicit Postgres relations between tables. `exams` maps to `training_types`, `exam_boards` maps to `exams`, and `board_member_assignments` maps to `exam_boards` and `personnel`.
*   **Constraint Triggers**: `exam_boards` has a unique constraint key `(exam_id, board_code)` ensuring board uniqueness under each exam.
*   **JSONB Column**: `exams.subjects_list` uses native PostgreSQL JSONB column serialization to store array lists of exam subject strings.

---

## Deployment Routing Map (Nginx)

Nginx handles port mapping and acts as a gateway for Gunicorn. 

*   Requests to `/` -> Serves built React index and JS/CSS assets directly.
*   Requests to `/api/` -> Proxy forwarded to Gunicorn server running at `http://backend:8000/api/`.
*   Requests to `/qlbm-admin/` -> Proxy forwarded to Django Admin panel at `http://backend:8000/qlbm-admin/`.
*   Static resources from Django (e.g. Django Admin Panel CSS files) -> Forwarded from `http://backend:8000/static/` directory.
