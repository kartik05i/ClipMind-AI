# ClipMind AI

**Video Summarization & Key Moments Detection Platform**

ClipMind AI turns long-form video — lectures, meetings, interviews, podcasts — into a transcript, a concise AI-generated summary, and a set of timestamped key moments, so viewers can get to the relevant part of a video in seconds instead of scrubbing through the whole recording.

> Internship Project — Infosys Springboard Internship (June 29, 2026 – August 29, 2026)
> Author: Kartik Jha

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Challenges & Fixes](#challenges--fixes)
- [Future Scope](#future-scope)
- [Documentation](#documentation)
- [License](#license)

---

## Overview

Reviewing lengthy videos to find one relevant section is slow and inefficient. ClipMind AI addresses this with an end-to-end AI pipeline:

```
Upload → Audio Extraction (FFmpeg) → Transcription (Whisper) → Summarization (BART/T5)
       → Key Moments & Highlights → Keyword Extraction (KeyBERT) → Insights & Storage
```

Each processing stage depends on the one before it completing successfully, keeping output consistent across videos of varying length and audio quality.

## Features

- **Video Upload & Management** — upload, validate, and store video content
- **Speech-to-Text Transcription** — automatic transcript generation via Whisper / faster-whisper
- **AI-Powered Summarization** — concise summaries generated from transcripts using BART/T5
- **Key Moments & Highlights** — timestamped identification of important segments
- **Keyword Extraction** — quick, scannable topic overview via KeyBERT
- **Learning Features** — bookmarks, learning history, and content organization
- **Analytics Dashboard** — usage and content insights
- **Role-Based Access Control** — Content Creator, Learner, Educator, and Administrator roles
- **Admin Tools** — user management, audit logs, platform settings, AI job monitoring

## Tech Stack

| Category | Technologies / Components |
|---|---|
| Frontend | React.js (Vite-based) |
| Backend | Python, FastAPI |
| Database | PostgreSQL, SQLAlchemy (ORM) |
| Speech-to-Text | Whisper, faster-whisper |
| Summarization | BART / T5 (transformer-based NLP models) |
| Keyword Extraction | KeyBERT |
| Media Processing | FFmpeg |
| Containerization | Docker |
| Version Control | Git & GitHub |

## System Architecture

The platform follows a client-server design:

```
Frontend Interface → API Service Layer → FastAPI Backend → Routers → Service Layer
     → Video / AI Processing → Data Management (PostgreSQL)
```

**Layers:**
- **User & Application Layer** — authentication, dashboard, upload, insights, learning, analytics, admin pages
- **Processing Layer** — FFmpeg-based media prep, Whisper-based transcription, downstream AI services
- **Service & Data Layer** — feature-specific routers, dedicated services, PostgreSQL data layer

Full architecture diagram available in [`docs/ClipMind_AI_Project_Documentation (2).pdf`](docs/ClipMind_AI_Project_Documentation (2).pdf).

## Project Structure

```
ClipMind-AI/
├── backend/
│   ├── core/              # configuration
│   ├── database/          # DB session & connection setup
│   ├── models/             # SQLAlchemy models
│   ├── routers/            # auth, users, video, transcript, summary,
│   │                       # key moments, highlights, keywords, bookmarks,
│   │                       # learning, dashboard, analytics, admin
│   ├── schemas/            # Pydantic schemas
│   ├── services/           # auth_service, ffmpeg_service, whisper_service,
│   │                       # summary_service, keymoment_service, keyword_service,
│   │                       # highlight_service, video_service, dashboard_service,
│   │                       # learning_material_service, transcript_service
│   ├── utils/
│   ├── main.py              # application entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/           # Dashboard, UploadVideo, MyVideos, UploadHistory,
│   │   │                    # ContentInsights, AIProcessingJobs, LearningMaterials,
│   │   │                    # LearningHistory, Bookmarks, Analytics, Admin, Profile
│   │   ├── services/        # authService, videoService, transcriptService,
│   │   │                    # summaryService, keyMomentService, highlightService,
│   │   │                    # keywordService, dashboard & analytics services
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── docs/
    └── ClipMind_AI_Project_Documentation (2).pdf
```

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- FFmpeg installed and available on PATH

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Docker Deployment

The backend is fully containerized and can be built and run with Docker:

```bash
cd backend
docker build -t clipmind-ai-backend .
docker run -p 8000:8000 --env-file .env clipmind-ai-backend
```

## Environment Variables

Create a `.env` file in the `backend/` directory (never commit this file — it's excluded via `.gitignore`):

```
DATABASE_URL=postgresql://user:password@localhost:5432/clipmind
SECRET_KEY=your-unique-secret-key
```

## Challenges & Fixes

A few notable issues encountered and resolved during development:

- **JSX rendering bug** — a container `div` in `UploadVideo.jsx` was closed prematurely, pushing content outside its styled card. Fixed by correcting the JSX closing tag.
- **Processing dependency chain** — the frontend originally allowed out-of-order processing requests (e.g. summary before transcript) against a backend that strictly enforces Upload → Transcript → Summary → Key Moments → Keywords. Fixed by disabling steps whose prerequisites hadn't completed and surfacing the backend's actual error detail in the UI.
- **Credentials handling** — a `.env` file was briefly included in shared project files. It was removed from version control and the secret key rotated before deployment.
- **Docker build failure** — an invalid pinned dependency, `starlette==1.3.1`, in `requirements.txt` caused the container build to fail. Corrected the version constraint; the backend now builds and runs consistently in Docker.

Full write-up of each issue is in the project documentation.

## Future Scope

- Improved AI models for summarization and key-moment detection
- Multi-language transcription and content analysis
- Near-real-time processing for live lectures and meetings
- Multimodal (audio + visual) key-moment detection
- Personalized learning recommendations
- Cloud-scale deployment for concurrent workloads
- Mobile application

## Documentation

Full project documentation — including problem statement, objectives, system architecture, module breakdown, implementation details, and challenges — is available at:
[`docs/CClipMind_AI_Project_Documentation (2).pdf`](docs/ClipMind_AI_Project_Documentation (2).pdf)

## License

This project was developed as part of the Infosys Springboard Internship Program.
