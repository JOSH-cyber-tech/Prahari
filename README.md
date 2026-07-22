# Prahari

**Prahari** is a comprehensive, AI-driven scam detection and protection platform designed to safeguard users from financial fraud, digital arrest scams, phishing, and other cyber threats. It combines lightning-fast offline detection with deep online LLM analysis, an intelligent conversational agent, and a powerful dashboard for cyber intelligence.

> **CRITICAL FEATURE:**  
> When Prahari detects a high-risk scam in offline mode, it instantly alerts the user and automatically sends an SMS or emergency call to a trusted contact, enabling immediate intervention to protect vulnerable individuals such as senior citizens and farmers.

---

## 🏗️ Project Architecture & Folders

The project is structured into multiple modular services and directories to handle everything from real-time classification to geospatial intelligence and conversational guidance.

- **`api/`**  
  Contains the core API endpoints (e.g., `app_fastapi.py`, `server.py`). It orchestrates requests for analysis, entity extraction, geospatial data, and fraud network graphs.

- **`ml/`**  
  The heart of the detection engine. Includes `detector.py` for blazing-fast rule-based & ML offline classification, and `llm_explainer.py` for deep AI analysis when online.

- **`bot/`**  
  Houses the conversational AI (`agent.py`) that interacts with users. Includes features like `calm_guidance.py` for de-escalation and `sarvam_translate.py` for multi-lingual support.

- **`rag/`**  
  Retrieval-Augmented Generation module. Manages vector stores (`chroma_store`, `faiss_store`, `legal_faiss_store`) and retrievers to provide accurate, context-aware, and legally sound advice.

- **`prahari_dashboard_backend/` & `prahari_dashboard_frontend/`**  
  The Command Workspace dashboard. The backend is built with FastAPI/Python, and the frontend is a modern React/Vite application. It provides visual insights into geospatial crime trends, fraud network clustering, and threat analysis.

- **`geo/` & `graph/`**  
  Services dedicated to Geospatial Crime Intelligence (mapping scam trends across districts) and Fraud Network Intelligence (clustering and graphing related fraud entities).

- **`llm/`**  
  Manages connections to Large Language Models (Gemini, Groq, Nemotron, Ollama) providing a robust fallback chain for intelligent scam analysis.

- **`voice/` & `webhook/`**  
  Handles on-device speech-to-text, call transcript processing, and real-time webhook integrations for continuous monitoring.

- **`assistant/`, `casefile/`, `data/`, `feedback/`, `kb/`, `link/`**  
  Supporting modules for managing user cases, knowledge bases, link analysis, and application data.

## 🚀 Key Capabilities

1. **Unified Classifier Engine (`/api/analyze`)**  
   Processes inputs from SMS, emails, WhatsApp, payment requests, or call transcripts. Operates in two modes:
   - **Offline (Fast):** ~6-10ms response time using rules and local ML, capable of triggering emergency alerts.
   - **Online (Deep):** Slower (~3-5s) but provides rich, LLM-generated reasoning and categorization.
2. **Geospatial & Network Intelligence**  
   Visualizes fraud networks and tracks scam outbreaks across different districts using heatmaps and trend analysis.
3. **Multi-lingual Calm Guidance**  
   The built-in bot not only identifies fraud but also guides panicked users calmly in their native language (via Sarvam integration).

## 🛠️ Getting Started

1. **Environment Setup:**  
   Copy `.env.example` to `.env` in the root directory and fill in the necessary API keys (e.g., `GEMINI_API_KEY`, `GROQ_API_KEY`, `TWILIO_ACCOUNT_SID` for emergency alerts).
2. **Backend Services:**  
   Run the API server from the `api/` directory or start the full dashboard backend via `prahari_dashboard_backend/`.
3. **Frontend Dashboard:**  
   Navigate to `prahari_dashboard_frontend/`, install dependencies with `npm install`, and run the Vite dev server with `npm run dev`.

---
*Prahari — Vigilant protection against digital deception.*
