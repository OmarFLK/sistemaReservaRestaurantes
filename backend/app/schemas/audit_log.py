from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.user import UserPublic


class AuditLogPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    action: str
    entity_type: str
    entity_id: int | None
    performed_by_user_id: int | None
    old_data: dict | None
    new_data: dict | None
    created_at: datetime
    performed_by: UserPublic | None = None
