from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url = "postgressql+psycopg://kt:ktpass@db:5432/knowledgetrees"
    backend_port = 8000

    cors_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

settings =  Settings()
