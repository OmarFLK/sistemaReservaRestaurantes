import os
from functools import lru_cache
from urllib.parse import urlsplit, urlunsplit

from dotenv import find_dotenv, load_dotenv
from pydantic import BaseModel, Field

load_dotenv(find_dotenv(usecwd=True))


class Settings(BaseModel):
    database_url: str = Field(min_length=1, alias="DATABASE_URL")
    jwt_secret: str = Field(min_length=1, alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=60,
        alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )
    cors_origins: str = Field(min_length=1, alias="CORS_ORIGINS")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def sqlalchemy_database_url(self) -> str:
        return normalize_postgres_driver(self.database_url)


def normalize_postgres_driver(database_url: str) -> str:
    parts = urlsplit(database_url)

    if parts.scheme == "postgresql":
        return urlunsplit(
            ("postgresql+psycopg", parts.netloc, parts.path, parts.query, parts.fragment),
        )

    return database_url


@lru_cache
def get_settings() -> Settings:
    values = {
        "DATABASE_URL": os.getenv("DATABASE_URL", ""),
        "JWT_SECRET": os.getenv("JWT_SECRET", ""),
        "JWT_ALGORITHM": os.getenv("JWT_ALGORITHM", "HS256"),
        "ACCESS_TOKEN_EXPIRE_MINUTES": int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"),
        ),
        "CORS_ORIGINS": os.getenv("CORS_ORIGINS", ""),
    }
    return Settings.model_validate(values)
