import os

DISABLE_HEAVY = os.environ.get("DISABLE_HEAVY_MODELS", "0") == "1"

import sys

# Real AI/ML logic (ml/, graph/, dashboard/, llm/, data/) lives at the repo
# root, two levels above this file (repo_root/prahari_dashboard_backend/app/
# main.py) -- not inside this FastAPI project. Add it to sys.path so
# app.services.classifier / app.services.graph can import those packages
# regardless of the process's cwd when uvicorn is launched.
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api import auth, analyze, entities, network, geospatial, report, trends, chat
from app.db.users_db import init_db

logger = logging.getLogger(__name__)

app = FastAPI(title="Prahari API", version="0.1.0")


@app.on_event("startup")
def on_startup():
    init_db()
    # This function is the ONLY explicit startup hook in this file -- it never
    # loaded any ML model itself (2026-09-11 audit). The real OOM cause was
    # upstream of here: the plain `from app.api import ... chat` import line
    # above transitively imported rag.embedder (constructed the real ~2GB
    # BGE-M3 model at module level) and llm.client (unconditionally imported
    # torch/FlagEmbedding/faiss on every platform). Both are now lazy --
    # loaded on first real use inside a request, not on import -- so nothing
    # heavy loads before this point regardless of DISABLE_HEAVY setting. This
    # log line exists so Render's deploy log states the config plainly.
    if DISABLE_HEAVY:
        logger.info("DISABLE_HEAVY_MODELS=1 -- embedding/RAG model will never load; /api/chat and /api/analyze's online mode will return a clear error instead of OOMing.")
    else:
        logger.info("Heavy models (BGE-M3 embedding) will lazy-load on first real request that needs them, not at startup.")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin,
        "http://localhost:5173",
        "https://prahari-rust.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Consistent error shape across all endpoints, matching the API contract doc:
# { "error": true, "code": "...", "message": "..." }
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": True, "code": "internal_error", "message": str(exc)},
    )


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(entities.router, prefix="/api", tags=["entities"])
app.include_router(report.router, prefix="/api/citizen", tags=["citizen"])
app.include_router(network.router, prefix="/api/network", tags=["network"])
app.include_router(geospatial.router, prefix="/api/geo", tags=["geospatial"])
app.include_router(trends.router, prefix="/api", tags=["trends"])
app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.get("/api/health")
def health_check():
    """Quick way to confirm the backend is up."""
    return {"status": "ok"}
