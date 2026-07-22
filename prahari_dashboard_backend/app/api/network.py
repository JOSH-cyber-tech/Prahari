"""
Fraud Network Intelligence routes. NetworkX-based, in-memory, computed
per request — no Neo4j, no pagination.
"""

from fastapi import APIRouter

from app.models.schemas import NetworkGraphResponse, NetworkClustersResponse

# NOTE: app.services.graph imports dashboard.graph_model / dashboard.seed_data,
# which don't exist anywhere in this repo. Falling back to the placeholder
# here so the server can start; see app/services/graph.py.
from app.services import graph as graph_service

router = APIRouter()


@router.get("/graph", response_model=NetworkGraphResponse)
def get_graph():
    data = graph_service.get_graph()
    return NetworkGraphResponse(**data)


@router.get("/clusters", response_model=NetworkClustersResponse)
def get_clusters():
    data = graph_service.get_clusters()
    return NetworkClustersResponse(**data)
