# Source Tree Analysis

This document catalogs the folders and files structure for the Graduation Exam Form Management system. It separates the project into Frontend (React/TypeScript) and Backend (Django/PostgreSQL) domains.

---

## Annotated Directory Tree

```
Quan ly bieu mau/ (Project Root)
├── backend/                  # Python Django Backend
│   ├── apps/                 # Custom Django apps namespace
│   │   └── core/             # Core app handling DB and REST APIs
│   │       ├── migrations/   # Auto-generated database migration scripts
│   │       ├── apps.py       # Core application configuration
│   │       ├── models.py     # Django database models mapping to PostgreSQL
│   │       ├── serializers.py# DRF JSON serializer classes
│   │       ├── urls.py       # App API endpoints routing declarations
│   │       └── views.py      # CRUD viewsets handling HTTP requests logic
│   ├── config/               # Project-level configurations package
│   │   ├── settings.py       # App settings (CORS, Database, Middlewares)
│   │   ├── urls.py           # Master routing entry point (maps to /api/)
│   │   └── wsgi.py           # Web Server Gateway Interface entry
│   ├── manage.py             # Django administrative management CLI script
│   └── requirements.txt      # Python packages dependencies checklist
│
├── docs/                     # Project knowledge documentation (AI Context)
│   ├── api-contracts-backend.md
│   ├── data-models-backend.md
│   ├── project-scan-report.json
│   └── source-tree-analysis.md
│
├── public/                   # Static browser files
├── src/                      # React TypeScript Frontend Codebase
│   ├── assets/               # Icons, images, style files
│   ├── components/           # UI View Pages and Layout components
│   │   ├── BoardsManagementView.tsx # Exam boards and staff assignments editor
│   │   ├── DashboardView.tsx        # High-level statistics KPI metrics page
│   │   ├── ExamsView.tsx            # Graduation exams manager with Excel import/export
│   │   ├── FormGeneratorView.tsx    # Live document preview & print controller
│   │   ├── Navbar.tsx               # Main side navigation layout component
│   │   ├── PersonnelView.tsx        # Staff profile manager with Excel import/export
│   │   ├── StatisticsView.tsx       # Collapsible exam logs and report exports
│   │   ├── TemplateEditorView.tsx   # Visual WYSIWYG Jodit Word editor and margins config
│   │   └── TrainingTypesView.tsx    # Training type metadata config page
│   ├── services/             # Core utility classes & services
│   │   ├── bulkExporter.ts          # Word document .doc single/ZIP exporter
│   │   ├── excelExporter.ts         # Multi-sheet statistics report generator
│   │   ├── initialData.ts           # Standalone offline mock seeding data
│   │   ├── storage.ts               # Two-way Client-Server API Sync wrapper
│   │   └── templateEngine.ts        # Double-curly braces template text compiler
│   ├── types/                # Static TypeScript typing declarations
│   │   └── schema.ts                # App entities interfaces (Exam, Personnel...)
│   ├── App.css               # Global application styling
│   ├── App.tsx               # Root component (orchestrates navigation and API sync)
│   ├── index.css             # Tailwind base inputs
│   └── main.tsx              # Web app bootstrap entry point
│
├── Dockerfile.backend        # Docker build recipe for Gunicorn/Django service
├── Dockerfile.frontend       # Multi-stage Nginx/React build recipe
├── docker-compose.yml        # Multi-container orchestration (DB, API, Web)
├── nginx.conf                # Nginx proxy mapping (web files and API gateways)
├── package.json              # Node dependencies configuration file
├── tailwind.config.js        # TailwindCSS configurations
└── vite.config.ts            # Vite bundler options and dev API proxy settings
```

---

## Critical Files and Entry Points

### 1. Backend Domain
*   **Entry Point**: [manage.py](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/backend/manage.py) (Local dev startup) / [wsgi.py](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/backend/config/wsgi.py) (Production Gunicorn server).
*   **Routing**: [urls.py](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/backend/config/urls.py) routes incoming `/api/` calls to the core app's viewsets.
*   **Data Structure**: [models.py](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/backend/apps/core/models.py) defines the PostgreSQL table schemas in Python.

### 2. Frontend Domain
*   **Entry Point**: [main.tsx](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/main.tsx) renders the root layout.
*   **API Client Layer**: [storage.ts](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/services/storage.ts) handles data loading and performs non-blocking POST/PUT/DELETE commands to the backend.
*   **Visual Layout Editor**: [TemplateEditorView.tsx](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/components/TemplateEditorView.tsx) embeds Jodit react editor and page margin adjustments.
