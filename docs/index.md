# Project Documentation Index

Welcome to the documentation database for the Graduation Exam Form Management system. This repository acts as the primary reference database for AI developers and onboarding engineers.

---

## Project Overview

*   **Type**: Multi-part client-server repository
*   **Primary Language**: TypeScript (v5) / Python (v3.11)
*   **Architecture**: Three-tier system (React SPA, Django REST API, PostgreSQL database) deployed via Docker Compose.

---

## Quick Reference By Part

### 1. Frontend Client (`frontend`)
*   **Type**: React Web Application
*   **Tech Stack**: Vite, React, TypeScript, TailwindCSS, Jodit, XLSX, docx-preview.
*   **Root Folder**: [d:/1.DEVELOPS/Quan ly bieu mau/src/](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/)
*   **Entry Point**: [d:/1.DEVELOPS/Quan ly bieu mau/src/main.tsx](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/src/main.tsx)

### 2. Backend Server (`backend`)
*   **Type**: Django REST API Backend
*   **Tech Stack**: Python, Django, Django REST Framework, PostgreSQL, Gunicorn.
*   **Root Folder**: [d:/1.DEVELOPS/Quan ly bieu mau/backend/](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/backend/)
*   **Entry Point**: [d:/1.DEVELOPS/Quan ly bieu mau/backend/manage.py](file:///d:/1.DEVELOPS/Quan%20ly%20bieu%20mau/backend/manage.py)

---

## Project Knowledge Database

Click on the links below to access detailed specifications:

### System Manuals
*   [Project Overview](./project-overview.md) - Context, business purpose, and functional scopes.
*   [System Architecture](./architecture.md) - Design invariants, deployment routes, and Nginx setups.
*   [Source Tree Analysis](./source-tree-analysis.md) - Detailed catalog of files, components, and directories.
*   [Development & Operations Guide](./development-guide.md) - Run commands, dependencies, and environment setup guidelines.

### API & Data Catalog
*   [REST API Contracts](./api-contracts-backend.md) - JSON API endpoint specifications, inputs, and payloads.
*   [Database Data Models](./data-models-backend.md) - PostgreSQL entity relations, tables, columns, and indexes.

---

## Getting Started

To run the application locally in one command, ensure Docker Desktop is running, open a shell in the root directory, and launch the compose stack:

```bash
docker compose up --build
```
Once initialized, visit **`http://localhost:8090/`** to view the application.
