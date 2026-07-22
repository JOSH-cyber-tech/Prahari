"""
Unified classifier route. Covers both Citizen Fraud Shield and
digital-arrest-style scams through a single endpoint — there is no
separate Digital Arrest route or model. Replaces the old
POST /api/citizen/analyze and POST /api/digital-arrest/analyze routes,
both removed.
"""

from fastapi import APIRouter

from app.models.schemas import AnalyzeRequest, AnalyzeResponse

# NOTE: app.services.classifier imports ml.detector / ml.llm_explainer,
# which depend on top-level ml/, data/, llm/ packages that were never
# actually brought into this repo (only ml_ai_overview/ was, and it's
# missing data/synth.py, llm/client.py, etc.). Falling back to the
# placeholder here so the server can start; see app/services/classifier.py.
from app.services.classifier import classify

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    result = classify(payload.text, payload.mode)
    return AnalyzeResponse(**result)
