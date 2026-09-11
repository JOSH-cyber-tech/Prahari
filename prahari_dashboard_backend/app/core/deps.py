"""
FastAPI dependencies for authenticated/role-gated routes.

Before this file existed, no route in the backend actually checked the
session cookie -- app/api/auth.py's GET /me was the only place that read
it. Command Workspace routes (network/geospatial) and the citizen report
endpoint were reachable by anyone, unauthenticated, and the "government"
vs "citizen" role was a label the frontend attached to itself with no
server-side backing at all. get_current_user/require_role are the fix:
role is read back from the DB row created at login (see api/auth.py),
never taken from anything the client sends on the request itself.
"""

from fastapi import Depends, HTTPException, Request

from app.core.session import SESSION_COOKIE_NAME, read_session_token
from app.db.users_db import get_user


def get_current_user(request: Request) -> dict:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    google_sub = read_session_token(token)
    if not google_sub:
        raise HTTPException(status_code=401, detail="Session expired or invalid.")

    user = get_user(google_sub)
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")

    return dict(user)


def require_role(role: str):
    def _check(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") != role:
            raise HTTPException(status_code=403, detail=f"Requires the '{role}' role.")
        return user

    return _check
