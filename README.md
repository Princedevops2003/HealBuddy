# HealBuddy

**HealBuddy** is a full-stack wellness tracker that helps users log sleep, hydration, steps, and mood—then visualize trends, stay consistent with streaks, and get light, rule-based wellness tips. It is built as a learning-friendly codebase with a clear separation between a Flask API and a React SPA.

---

## Project overview

HealBuddy lets people register an account, sign in with JWT-based authentication, and maintain a daily health journal. The dashboard summarizes **today’s metrics**, **seven-day trends** (including Chart.js graphs for water and steps), and a **logging streak** that rewards consecutive days of entries. A built-in **tips assistant** answers questions about hydration, sleep, exercise, and stress using simple keyword rules—no external AI API and no cost to run.

The backend persists data in **SQLite** by default (or **PostgreSQL** when `DATABASE_URL` is set), making it easy to develop locally and deploy to platforms like Render.

---

## Features

| Area | Description |
|------|-------------|
| **Authentication** | Email/password signup and login; passwords hashed with Werkzeug; API access via **JWT** (`Bearer` token). |
| **Dashboard** | Today’s sleep, water, steps, and mood in card layout; weekly averages; water (bar) and steps (line) charts. |
| **History** | Paginated-style list of past entries (table on desktop, cards on mobile). |
| **Streaks** | Consecutive-day logging tracked server-side (`streak_count`, `last_entry_date`); increments on back-to-back days, resets if the gap is more than one day. |
| **AI-style suggestions** | Floating **HealBuddy tips** chat: rule-based replies for hydration, sleep, exercise, and stress. Includes a clear **not medical advice** disclaimer. |
| **Profile** | Account summary and quick refresh of server data. |
| **Ops** | Health check endpoint (`/health`), optional **Docker** / **docker-compose**, **GitHub Actions** CI, deployment notes for **Render**. |

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **API** | Python 3, **Flask**, **Flask-SQLAlchemy**, **PyJWT**, **Flask-CORS**, **Gunicorn** (production) |
| **Database** | **SQLite** (default, `instance/healbuddy.db`) or **PostgreSQL** (`psycopg2-binary`) |
| **Auth** | **JWT** in `Authorization` header; secrets from environment variables |
| **Frontend** | **React** (Vite), **React Router**, **Tailwind CSS**, **Chart.js** / **react-chartjs-2** |
| **Tooling** | `python-dotenv`, GitHub Actions, Docker |

---

## Setup

### Prerequisites

- **Python** 3.11+ recommended  
- **Node.js** 20+ and npm  
- (Optional) Docker and Docker Compose  

### 1. Clone and configure the API

```bash
git clone <your-repo-url>
cd Healbuddy
python -m venv .venv
```

Activate the virtual environment:

- **Windows:** `.venv\Scripts\activate`  
- **macOS / Linux:** `source .venv/bin/activate`

```bash
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and set strong values for **`SECRET_KEY`** and **`JWT_SECRET`**. Leave **`DATABASE_URL`** unset to use SQLite under `instance/`.

```bash
python run.py
```

The API serves at **http://127.0.0.1:5000**. Verify **http://127.0.0.1:5000/health** returns `{"status":"ok"}`.

### 2. Run the React app

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (typically **http://127.0.0.1:5173**). In development, requests to **`/api`** are proxied to the Flask server.

For a **production build** that talks to a hosted API, set **`VITE_API_BASE`** to your API origin (see `frontend/.env.example`), then:

```bash
npm run build
```

Serve the contents of `frontend/dist` from any static host (Render Static Site, Netlify, Vercel, etc.).

### 3. Optional: Docker API only

```bash
docker compose up --build
```

API: **http://127.0.0.1:5000** (SQLite persisted in a Compose volume). See the root **`Dockerfile`** for a container-only build.

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Flask secret key (required in production) |
| `JWT_SECRET` | Key used to sign JWT access tokens |
| `DATABASE_URL` | Optional; PostgreSQL connection string. If omitted, SQLite is used. |
| `FLASK_DEBUG` | `true` for local dev; `false` in production |

---

## Screenshots

> Add your own images here after you capture the app running locally or in production.

| Screen | Suggested filename | Description |
|--------|--------------------|-------------|
| Login / Sign up | `docs/screenshots/auth.png` | Tabbed auth screen |
| Dashboard | `docs/screenshots/dashboard.png` | Cards, charts, streak (from API) |
| History | `docs/screenshots/history.png` | Entry list or empty state |
| Tips chat | `docs/screenshots/chatbot.png` | Floating assistant + disclaimer |

**Tip:** Create a `docs/screenshots/` folder, save PNGs, and link them in this section, for example:

```markdown
![Dashboard](docs/screenshots/dashboard.png)
```

---

## API reference (short)

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/health` | No |
| `POST` | `/register` | No |
| `POST` | `/login` | No |
| `GET` | `/dashboard` | JWT |
| `POST` | `/add-entry` | JWT |
| `GET` | `/history` | JWT |

The dashboard **`user`** object includes **`streak_count`** and **`last_entry_date`** when the backend supports streaks.

---

## Project structure

```
Healbuddy/
├── app/                    # Flask package (models, routes, utils, JWT)
├── frontend/               # React + Vite + Tailwind
├── .github/workflows/      # CI (backend smoke test + frontend build)
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── run.py                  # Dev server; Gunicorn target: run:app
├── .env.example
└── README.md
```

---

## Deployment notes

- **Render:** Connect the repo as a **Web Service** (Dockerfile or Python + `gunicorn --bind 0.0.0.0:$PORT run:app`). Set `SECRET_KEY`, `JWT_SECRET`, and optionally attach **PostgreSQL** for durable data. Health check path: **`/health`**.  
- **CI:** Pushes to `main` / `master` run `.github/workflows/ci.yml` (Python install + `/health` smoke test; `npm ci` + `npm run build` in `frontend/`).

---

## Future improvements

- **Mobile app** or PWA offline support for quicker logging  
- **Email verification** and password reset flow  
- **Goals & reminders** (daily water target, bedtime nudges)  
- **Export** (CSV/PDF) and richer **history** filters  
- **Optional LLM integration** behind a feature flag, keeping the current rule-based bot as a free default  
- **Unit and E2E tests** expanded beyond CI smoke checks  
- **Stricter CORS** and rate limiting for public deployments  

---

## Disclaimer

HealBuddy’s in-app tips are **general wellness ideas only** and **not medical advice**. For health concerns, consult a qualified professional.

---

## License

Use and modify freely for your own learning and projects.
