from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    *,
    action: str,
    entity_type: str,
    entity_id: int | None,
    performed_by_user_id: int | None,
    old_data: dict | None = None,
    new_data: dict | None = None,
) -> AuditLog:
    audit_log = AuditLog(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        performed_by_user_id=performed_by_user_id,
        old_data=old_data,
        new_data=new_data,
    )
    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)
    return audit_log


def list_audit_logs(db: Session, limit: int = 100) -> list[AuditLog]:
    statement = (
        select(AuditLog)
        .options(selectinload(AuditLog.performed_by))
        .order_by(AuditLog.created_at.desc())
        .limit(limit)
    )
    return list(db.scalars(statement))
