from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from app.core.deps import require_role
from app.models.schemas import (
    GeoComplaintsResponse,
    GeoDistrictStatsResponse,
    GeoScamTypesResponse,
    GeoTrendResponse,
)
from app.services import geo_service

router = APIRouter()


@router.get("/complaints", response_model=GeoComplaintsResponse)
def get_complaints(
    scam_type: Optional[List[str]] = Query(default=None),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    district: Optional[str] = None,
    _user: dict = Depends(require_role("government")),
):
    complaints = geo_service.get_complaints(
        scam_types=scam_type,
        start_date=start_date,
        end_date=end_date,
        district=district,
    )
    return GeoComplaintsResponse(complaints=complaints)


@router.get("/districts/stats", response_model=GeoDistrictStatsResponse)
def get_district_stats(
    scam_type: Optional[List[str]] = Query(default=None),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    _user: dict = Depends(require_role("government")),
):
    stats = geo_service.get_district_stats(
        scam_types=scam_type,
        start_date=start_date,
        end_date=end_date,
    )
    return GeoDistrictStatsResponse(districts=stats)


@router.get("/trend", response_model=GeoTrendResponse)
def get_trend(
    scam_type: Optional[List[str]] = Query(default=None),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    _user: dict = Depends(require_role("government")),
):
    return GeoTrendResponse(**geo_service.get_trend(
        scam_types=scam_type,
        start_date=start_date,
        end_date=end_date,
    ))


@router.get("/scam-types", response_model=GeoScamTypesResponse)
def get_scam_types(_user: dict = Depends(require_role("government"))):
    return GeoScamTypesResponse(scam_types=geo_service.get_scam_types())
