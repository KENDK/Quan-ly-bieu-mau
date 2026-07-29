# Development and Operations Guide

This guide details the setup and operational workflows for the Graduation Exam Form Management system.

---

## Technical Prerequisites

To develop or deploy this project, ensure you have the following software installed:
1.  **Node.js** (Version 20.x recommended) and **npm** (Version 10.x+).
2.  **Python** (Version 3.11.x) with `pip` package manager.
3.  **Docker Desktop** (with Compose enabled) for production/test container orchestration.

---

## Local Development Workflow

You can run both frontend and backend systems locally without Docker containers for faster developer iterations.

### 1. Backend Setup (Django & PostgreSQL)
Configure your local environment to run Python and connect to a running PostgreSQL database:

1.  Navigate to the project root directory.
2.  Install Python dependencies:
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  Set up env variables (e.g. database credentials):
    ```bash
    # Windows PowerShell
    $env:DATABASE_URL="postgres://qlbm_user:qlbm_password@localhost:5432/qlbm_db"
    $env:DEBUG="True"
    ```
4.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
5.  Generate and apply database migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
6.  Start local development server:
    ```bash
    python manage.py runserver 127.0.0.1:8000
    ```

### 2. Frontend Setup (React & Vite)
Start the Vite developer server, which is preconfigured with a proxy to forward API calls to Gunicorn:

1.  Open another terminal window at the project root folder.
2.  Install packages (use `--legacy-peer-deps` to allow jodit-react dependencies to install cleanly on React 18):
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Start Vite dev server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173/` in your browser. All requests to `/api/*` will be proxied to `http://127.0.0.1:8000/api/*` in the background.

---

## Production Deployment Workflow (Docker Container)

Deploying the stack via Docker compose maps all elements and runs them in a unified environment.

### 1. Build and Run Container Services
Build the Nginx, Django, and PostgreSQL containers:

```bash
docker compose up --build
```

**What happens on startup:**
1.  **Database Container (`qlbm_db`)**: Starts PostgreSQL on host port `5433` (maps to internal port `5432`). Data is persisted in `postgres_data` Docker volume.
2.  **Backend Container (`qlbm_backend`)**: Installs requirements, runs `makemigrations` and `migrate` automatically, then starts the Gunicorn web server internally on port `8000`.
3.  **Frontend Container (`qlbm_frontend`)**: Performs NPM installation and builds static React assets under production mode, then hosts them using Nginx on host port `8090`.

### 2. Verify Deployments
*   Open the web application: **`http://localhost:8090/`**.
*   Open the Django Admin panel: **`http://localhost:8090/qlbm-admin/`**.
*   Connect directly to PostgreSQL database from a host tool (e.g. pgAdmin or DBeaver):
    *   **Host**: `localhost`
    *   **Port**: `5433`
    *   **Database**: `qlbm_db`
    *   **User**: `qlbm_user`
    *   **Password**: `qlbm_password`

---

## Common Administrative Commands (inside Docker)

### Create Django Superuser (for Admin Login)
To log into `http://localhost:8090/qlbm-admin/`, create a superuser inside the running backend container:

```bash
docker exec -it qlbm_backend python manage.py createsuperuser
```
Follow the terminal prompts to input username, email, and password.
