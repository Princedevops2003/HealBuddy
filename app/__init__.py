import os
from pathlib import Path

from flask import Flask
from flask_cors import CORS
from sqlalchemy import inspect, text
from sqlalchemy.engine.url import URL

from app.config import Config
from app.extensions import db


def _ensure_user_streak_columns() -> None:
    """Add streak columns to existing SQLite/Postgres DBs (create_all does not alter tables)."""
    try:
        inspector = inspect(db.engine)
        cols = {c["name"] for c in inspector.get_columns("users")}
    except Exception:
        return
    with db.engine.begin() as conn:
        if "streak_count" not in cols:
            conn.execute(
                text("ALTER TABLE users ADD COLUMN streak_count INTEGER DEFAULT 0 NOT NULL")
            )
        if "last_entry_date" not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN last_entry_date DATE"))


def create_app(config_class=Config):
    project_root = Path(__file__).resolve().parent.parent
    instance_dir = project_root / "instance"
    instance_dir.mkdir(parents=True, exist_ok=True)

    app = Flask(__name__, instance_path=str(instance_dir))
    
    app.config.from_object(config_class)
    CORS(app)

    if not os.environ.get("DATABASE_URL"):
        db_file = instance_dir / "healbuddy.db"
        app.config["SQLALCHEMY_DATABASE_URI"] = str(
            URL.create("sqlite", database=str(db_file.resolve()))
        )

    db.init_app(app)

    with app.app_context():
        from app import models  # noqa: F401 — register models with SQLAlchemy

        db.create_all()
        _ensure_user_streak_columns()

    from app.routes.auth import auth_bp
    from app.routes.health import health_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(health_bp)

    @app.get("/health")
    def health():
        return {"status": "ok"}, 200

    return app
