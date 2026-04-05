import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
    # Default SQLite path is set in create_app() using app.instance_path unless DATABASE_URL is set.
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET = os.environ.get("JWT_SECRET", "jwt-secret-change-in-production")
    JWT_EXPIRATION = timedelta(hours=24)
