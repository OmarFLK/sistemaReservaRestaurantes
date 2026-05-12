from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


_engine = None


def get_engine():
    global _engine

    if _engine is None:
        _engine = create_engine(get_settings().sqlalchemy_database_url, pool_pre_ping=True)

    return _engine


def create_db_session() -> Session:
    session_factory = sessionmaker(
        bind=get_engine(),
        autocommit=False,
        autoflush=False,
    )
    return session_factory()


def get_db() -> Generator[Session, None, None]:
    db = create_db_session()
    try:
        yield db
    finally:
        db.close()
