from pydantic import BaseModel


class PlatformSettingsUpdate(BaseModel):
    platform_name: str
    platform_description: str | None = None
    maintenance_mode: bool
    max_upload_size: int
    allowed_formats: str
    default_visibility: str
    default_language: str
    auto_processing: bool


class PlatformSettingsResponse(PlatformSettingsUpdate):
    id: int

    class Config:
        from_attributes = True