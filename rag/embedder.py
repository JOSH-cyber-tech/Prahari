import os

# DISABLE_HEAVY_MODELS=1 kill switch, added 2026-09-11: this used to
# construct BGEM3FlagModel("BAAI/bge-m3") at module level, so merely
# IMPORTING rag.embedder (which rag.store/rag.legal_store both do at their
# own module level) loaded the real ~2GB model into RAM immediately -- on
# prahari_dashboard_backend, that happens transitively off `main.py`'s plain
# `from app.api import ... chat` import line, before the app even finishes
# starting up. This is what was OOM-killing the deployed service on
# Render's 512MB free tier. Now lazy: nothing imports or constructs the
# model until embed() is actually called by a real request.
_DISABLE_HEAVY_MODELS = os.environ.get("DISABLE_HEAVY_MODELS", "0") == "1"

_embed_model = None


def _get_embed_model():
    global _embed_model
    if _DISABLE_HEAVY_MODELS:
        raise RuntimeError(
            "Embedding model disabled (DISABLE_HEAVY_MODELS=1) -- RAG "
            "retrieval is unavailable on this deployment."
        )
    if _embed_model is None:
        from FlagEmbedding import BGEM3FlagModel
        _embed_model = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)
    return _embed_model


def embed(texts: list[str]) -> list[list[float]]:
    output = _get_embed_model().encode(
        texts,
        batch_size=12,
        max_length=512,
        return_dense=True,
    )
    return output["dense_vecs"].tolist()
