# Prahari

**Prahari** ("sentinel" in Sanskrit) is an AI-driven scam detection and protection platform built to safeguard people from financial fraud, digital-arrest scams, phishing, and other cyber threats. It pairs a sub-10ms offline classifier with deep online LLM analysis, a multilingual conversational agent, and a cyber-intelligence dashboard for investigators.

> **Critical safety feature:** when Prahari's offline detector flags a high-risk scam, it immediately alerts the user and can trigger an SMS or emergency call to a trusted contact — giving family or caregivers a window to intervene for vulnerable users such as senior citizens and farmers.

---

## Contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Key capabilities](#key-capabilities)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)

---

## Architecture

```
                        ┌───────────────────────────┐
   SMS / Email / Call ─▶│   Unified Classifier       │
   WhatsApp / Payment    │   POST /api/analyze        │
                        │   offline (rules+ML, ~10ms) │
                        │   online (LLM, ~3-5s)       │
                        └──────────────┬─────────────┘
                                       │
        ┌─────────────┬───────────────┼───────────────┬────────────────┐
        ▼             ▼               ▼               ▼                ▼
  ml/ (detector,  bot/ (agent,   rag/ (Chroma/    geo/ + graph/    llm/ (Gemini →
  llm_explainer)  calm_guidance, FAISS retrieval  (crime heatmaps, Groq → Nemotron →
                  sarvam_translate) for legal RAG) fraud networks)  Ollama fallback)
        │
        ▼
  prahari_dashboard_backend (FastAPI) ──▶ prahari_dashboard_frontend (React/Vite)
```

The offline path never leaves the device/server process — no network call is required to produce a verdict, which is what keeps latency in the single-digit milliseconds and lets the emergency-alert flow fire even without connectivity to an LLM provider. The online path enriches that verdict with LLM-generated reasoning through the fallback chain in `llm/client.py`.

## Tech stack

**Backend / API**
- [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/) — `prahari_dashboard_backend/`, `api/`, `webhook/`
- [Pydantic](https://docs.pydantic.dev/) / `pydantic-settings` — request/response schemas & config
- SQLite (`users.db`) for dashboard auth/user storage
- `google-auth` + `@react-oauth/google` for Google OAuth login
- `itsdangerous` for signed session cookies

**AI / ML / LLM**
- LLM providers, via a fallback chain in `llm/client.py`: **Gemini** (`google-genai`), **Groq** (`groq`), **Nemotron** (NVIDIA API), **Ollama** (local, last-resort)
- `scikit-learn` — offline rule/ML classifier (`ml/detector.py`)
- `networkx` — fraud entity relationship graphs (`graph/fraud_graph.py`)
- **RAG stack:** `faiss-cpu` (vector index, `rag/store.py`) + `FlagEmbedding` (BGE-M3 embeddings, `rag/embedder.py`) + `torch` (CPU-only build) + Chroma vector store for legal retrieval
- `rank_bm25` — lexical/hybrid retrieval alongside vector search
- `sarvamai` — multilingual translation & speech (`bot/sarvam_translate.py`, `voice/`)
- OCR/parsing: `easyocr`, `pytesseract`, `pdfplumber`, `Pillow`, `beautifulsoup4`, `feedparser` — used by `data/` harvesting pipelines and document/image intake

**Messaging / Alerts**
- `twilio` — SMS/emergency-call alerts to trusted contacts on high-risk offline verdicts

**Frontend (dashboard)**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) — `prahari_dashboard_frontend/`
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) — threat/analytics charts
- [react-map-gl](https://visgl.github.io/react-map-gl/) + [MapLibre GL](https://maplibre.org/) + `supercluster` — geospatial crime heatmaps and clustering
- [react-three-fiber](https://docs.pmnd.rs/react-three-fiber) / `drei` / `three.js` + `@react-three/postprocessing` — 3D visualizations
- `framer-motion`, `gsap` / `@gsap/react`, `lottie-web` — animation
- `@dnd-kit/*` — drag-and-drop dashboard widgets
- `react-router-dom` — client-side routing
- `oxlint` — linting

**Testing**
- `pytest` — Python test suites (`bot/test_agent.py`, `rag/test_rag.py`, `graph/test_graph.py`, `kb/test_kb.py`, etc.)

**Deployment**
- [Render](https://render.com/) (`render.yaml`) and [Hugging Face Spaces](https://huggingface.co/spaces) (`Dockerfile`) for the backend
- [Vercel](https://vercel.com/) (`vercel.json`) for the frontend

## Key capabilities

1. **Unified Classifier Engine — `POST /api/analyze`**
   One endpoint handles SMS, email, WhatsApp, payment requests, and call transcripts (including digital-arrest scams delivered as `call_transcript`). Two modes:
   - **Offline (fast):** ~6–10ms, rule-based + local ML, can trigger emergency alerts.
   - **Online (deep):** ~3–5s, LLM-generated `reason` and `categories` via the Gemini→Groq→Nemotron→Ollama fallback chain.
2. **Emergency alerting** — high-risk offline verdicts can dispatch an SMS/call to a trusted contact via Twilio.
3. **Geospatial & network intelligence** — `geo/` and `graph/` surface scam heatmaps by district and cluster related fraud entities into networks, visualized in the dashboard.
4. **Legal RAG** — `rag/` retrieves grounded, legally sound guidance (Chroma/FAISS vector stores) so advice given to users cites real statutes/procedures instead of hallucinating them.
5. **Multilingual calm guidance** — `bot/agent.py` de-escalates panicked users and translates guidance via Sarvam (`bot/sarvam_translate.py`, `bot/languages.py`).
6. **Cyber-intelligence dashboard** — `prahari_dashboard_backend/` (FastAPI) + `prahari_dashboard_frontend/` (React/Vite) give investigators a workspace over all of the above.

## Repository layout

| Path | Purpose |
|---|---|
| `api/` | Core API entrypoints (`app_fastapi.py`, `server.py`) orchestrating analysis, entity extraction, geo, and graph requests. |
| `ml/` | Detection engine: `detector.py` (offline rules/ML), `llm_explainer.py` (online LLM reasoning), `export_offline_model.py`, `session.py`. |
| `bot/` | Conversational agent (`agent.py`), de-escalation (`calm_guidance.py`), multilingual support (`sarvam_translate.py`, `languages.py`). |
| `rag/` | Retrieval-Augmented Generation: `store.py`, `embedder.py`, `retriever.py`, plus Chroma/FAISS/legal FAISS vector stores and `legal_store.py`/`legal_retriever.py`. |
| `geo/` | Geospatial crime intelligence (`geo_fraud.py`) — scam trends by district. |
| `graph/` | Fraud network intelligence: `entity_extractor.py`, `fraud_graph.py`, clustering related fraud entities into graphs. |
| `dashboard/` | Graph data models and seed data backing the dashboard (`graph_model.py`, `seed_data.py`, `telecom_circles.py`). |
| `llm/` | Multi-provider LLM client (`client.py`) with a Gemini → Groq → Nemotron → Ollama fallback chain. |
| `voice/` | On-device speech-to-text and call transcript processing (`voice_fraud.py`). |
| `webhook/` | Real-time webhook integrations for continuous monitoring (`app.py`). |
| `assistant/` | Guardrails, hybrid search, and pipeline glue for the conversational assistant. |
| `casefile/` | Case generation from classified/aggregated fraud data. |
| `data/` | Harvesting, scraping, classification, and dedup pipelines for training/reference data (I4C, PIB sources). |
| `feedback/` | User/analyst feedback capture and storage. |
| `kb/` | Static knowledge base (`scams.json`, `legal_info.json`) and its schema/loader. |
| `link/` | URL safety checks for phishing/malicious links. |
| `prahari_dashboard_backend/` | FastAPI backend for the Command Workspace dashboard — auth, DB, API routes. |
| `prahari_dashboard_frontend/` | React/Vite frontend for the dashboard. |
| `prahari-api-contract.md` | Source-of-truth summary of request/response schemas for every route (schemas file itself wins on conflicts). |

## Getting started

### 1. Environment

Copy `.env.example` to `.env` **at the repo root** (not inside `prahari_dashboard_backend/`) and fill in the keys you need:

```bash
cp .env.example .env
```

`llm/client.py` resolves this file relative to its own path, so every service that goes through the LLM fallback chain — `ml/llm_explainer.py`, `rag/retriever.py`, `bot/agent.py`, and the dashboard backend's `/api/analyze` (online mode) and `/api/chat` — depends on it living at the root.

### 2. Backend (dashboard API)

```bash
cd prahari_dashboard_backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend (dashboard)

```bash
cd prahari_dashboard_frontend
npm install
npm run dev
```

### 4. Standalone classifier API (optional)

The lighter-weight classifier API in `api/` can be run independently of the dashboard backend for direct `/api/analyze` integration testing:

```bash
cd api
python app_fastapi.py
```

## API reference

Full request/response contracts live in [`prahari-api-contract.md`](./prahari-api-contract.md). Highlights:

- **`POST /api/analyze`** — unified classifier. `{ text, source_type, mode }` → `{ risk_score, verdict, categories, reason }`. Empty input always returns a fixed `SAFE` result.
- **`POST /api/extract_entities`** — pulls structured entities (phone numbers, UPI IDs, links, etc.) out of raw text for the fraud graph.

See the contract doc for the remaining endpoints (geospatial, fraud graph, casefile, feedback) and their exact schemas — the doc calls out which routes are `FINAL` vs. `PENDING AI/ML HANDOFF`.

## Deployment

- **Backend (Render):** `render.yaml` deploys `prahari_dashboard_backend` via `uvicorn app.main:app`, with `FRONTEND_ORIGIN` locked to the production Vercel URL and `GEMINI_API_KEY`/`GROQ_API_KEY` supplied as secrets.
- **Backend (Hugging Face Spaces):** `Dockerfile` builds a Python 3.11 slim image, installs `prahari_dashboard_backend/requirements.txt`, and serves on port `7860` (the port HF Spaces expects).
- **Frontend (Vercel):** `prahari_dashboard_frontend/vercel.json` configures the Vite build for deployment.

## Environment variables

| Variable | Used by | Required for |
|---|---|---|
| `GEMINI_API_KEY` | `llm/client.py` fallback chain | Online analysis, chat |
| `GROQ_API_KEY` | `llm/client.py` fallback chain | Online analysis, chat |
| `NVIDIA_API_KEY` | `llm/client.py` (Nemotron tier) | Optional third-tier LLM fallback |
| `SARVAM_API_KEY` | `bot/sarvam_translate.py` | Multilingual calm guidance |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_WHATSAPP_FROM` | Emergency alert dispatch | SMS/call alerts to trusted contacts |
| `PUBLIC_BASE_URL` | Webhook callbacks | `webhook/` integrations |
| `CHAT_API_KEY` | Dashboard chat auth | `prahari_dashboard_backend` `/api/chat` |

Ollama, the last-resort local LLM fallback, needs no API key — it just needs to be running locally with the expected model pulled.

---

*Prahari — vigilant protection against digital deception.*
