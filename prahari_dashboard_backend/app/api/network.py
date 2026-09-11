"""
Fraud Network Intelligence routes. NetworkX-based, in-memory, computed
per request — no Neo4j, no pagination.
"""

from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.models.schemas import NetworkGraphResponse, NetworkClustersResponse
from app.services import graph as graph_service

router = APIRouter()


@router.get("/graph", response_model=NetworkGraphResponse)
def get_graph(_user: dict = Depends(require_role("government"))):
    data = graph_service.get_graph()
    return NetworkGraphResponse(**data)


@router.get("/clusters", response_model=NetworkClustersResponse)
def get_clusters(_user: dict = Depends(require_role("government"))):
    data = graph_service.get_clusters()
    return NetworkClustersResponse(**data)
