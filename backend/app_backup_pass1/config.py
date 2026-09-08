from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "sqlite:///./krishi_marg.db"
    jwt_secret: str = "change-me-in-local-env"
    osrm_url: str = "https://router.project-osrm.org"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    operating_city: str = "Hyderabad"
    operating_lat: float = 17.3850
    operating_lon: float = 78.4867
    service_radius_km: float = 55
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
