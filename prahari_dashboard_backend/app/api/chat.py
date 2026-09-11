"""
Assistant chat route -- RAG + multilingual LLM orchestration
(bot.agent.chat()). See app/services/chat.py for what it actually calls.
"""

from fastapi import APIRouter, Request

from app.core.limiter import limiter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.chat import chat as chat_service

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
def chat(request: Request, payload: ChatRequest):
    result = chat_service(payload.session_id, payload.message)
    return ChatResponse(**result)
