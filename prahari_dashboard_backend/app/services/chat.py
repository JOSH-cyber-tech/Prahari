"""
Assistant chat service -- thin wrapper around bot.agent.chat(), this
repo's actual LLM-orchestration entry point: intent classification, RAG
retrieval over kb/scams.json (rag/retriever.py, FAISS-backed), multilingual
support (bot/languages.py, bot/sarvam_translate.py), and generation via the
Gemini -> Groq -> Nemotron -> Ollama chain (llm/client.py).

Session state (conversation history, repeat-scam pattern detection) is
kept in-memory inside bot.agent itself, keyed by session_id -- the same
model the WhatsApp bot already uses. Nothing here re-implements any of
that; this file only adapts bot.agent.chat()'s dict return into the
declared ChatResponse contract.
"""
from bot.agent import chat as _chat


def chat(session_id: str, message: str) -> dict:
    return _chat(session_id, message)
