"""
Unified classifier route. Covers both Citizen Fraud Shield and
digital-arrest-style scams through a single endpoint — there is no
separate Digital Arrest route or model. Replaces the old
POST /api/citizen/analyze and POST /api/digital-arrest/analyze routes,
both removed.
"""

from fastapi import APIRouter, Request

from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.classifier import classify

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: Request):
    # FraudShield.jsx posts application/json when there's no attachment,
    # but switches to multipart/form-data (text/source_type/mode fields +
    # an "evidence" file list) as soon as the user attaches a screenshot/
    # PDF. A plain `payload: AnalyzeRequest` parameter only parses JSON
    # bodies, so every attachment submission 422'd before reaching the
    # classifier. Branch on content-type and pull the same three fields
    # out of whichever body shape arrived. Attached files aren't OCR'd
    # here (no OCR pipeline wired into this backend yet) -- only the
    # `text` field the user typed is classified.
    content_type = request.headers.get("content-type", "")
    if content_type.startswith("multipart/form-data"):
        form = await request.form()
        raw = {"text": form.get("text", ""), "source_type": form.get("source_type", "sms"), "mode": form.get("mode", "offline")}
    else:
        raw = await request.json()

    payload = AnalyzeRequest.model_validate(raw)
    result = classify(payload.text, payload.mode)
    return AnalyzeResponse(**result)
