from datetime import date

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    streak_count = db.Column(db.Integer, nullable=False, default=0)
    last_entry_date = db.Column(db.Date, nullable=True)

    entries = db.relationship(
        "HealthEntry",
        backref="user",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "streak_count": self.streak_count if self.streak_count is not None else 0,
            "last_entry_date": self.last_entry_date.isoformat()
            if self.last_entry_date
            else None,
        }


class HealthEntry(db.Model):
    __tablename__ = "health_entries"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    sleep = db.Column(db.Float, nullable=True)
    water = db.Column(db.Float, nullable=True)
    steps = db.Column(db.Integer, nullable=True)
    mood = db.Column(db.String(64), nullable=True)
    date = db.Column(db.Date, nullable=False, index=True)

    __table_args__ = (db.UniqueConstraint("user_id", "date", name="uq_user_entry_date"),)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "sleep": self.sleep,
            "water": self.water,
            "steps": self.steps,
            "mood": self.mood,
            "date": self.date.isoformat() if isinstance(self.date, date) else self.date,
        }
