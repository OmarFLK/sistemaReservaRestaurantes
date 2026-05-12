from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import admin, auth, health, reservations, tables


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Restaurant Reservation System API",
        version="0.1.0",
        description="FastAPI backend for restaurant reservations.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(tables.router)
    app.include_router(reservations.router)
    app.include_router(admin.router)
    return app


app = create_app()
