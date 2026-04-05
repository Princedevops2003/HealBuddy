from datetime import date, datetime, timedelta

from flask import Blueprint, g, jsonify, request
from sqlalchemy import func

from app.extensions import db
from app.models import HealthEntry, User
from app.utils.jwt_middleware import token_required
from app.utils.streak import update_user_streak

health_bp = Blueprint("health", __name__)


def _parse_entry_date(value):
    if value is None or value == "":
        return date.today()
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        try:
            return date.fromisoformat(value)
        except ValueError:
            return None
    return None


@health_bp.get("/dashboard")
@token_required
def dashboard():
    user = User.query.get(g.current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    today = date.today()
    today_entry = HealthEntry.query.filter_by(user_id=user.id, date=today).first()

    week_start = today - timedelta(days=6)
    week_entries = (
        HealthEntry.query.filter(HealthEntry.user_id == user.id, HealthEntry.date >= week_start)
        .order_by(HealthEntry.date.asc())
        .all()
    )

    totals = {
        "entries_count": len(week_entries),
        "avg_sleep": None,
        "avg_water": None,
        "total_steps": 0,
    }
    if week_entries:
        sleeps = [e.sleep for e in week_entries if e.sleep is not None]
        waters = [e.water for e in week_entries if e.water is not None]
        if sleeps:
            totals["avg_sleep"] = round(sum(sleeps) / len(sleeps), 2)
        if waters:
            totals["avg_water"] = round(sum(waters) / len(waters), 2)
        totals["total_steps"] = sum(e.steps or 0 for e in week_entries)

    return jsonify(
        {
            "user": user.to_dict(),
            "today": today_entry.to_dict() if today_entry else None,
            "last_7_days": [e.to_dict() for e in week_entries],
            "summary_last_7_days": totals,
        }
    )


@health_bp.post("/add-entry")
@token_required
def add_entry():
    data = request.get_json(silent=True) or {}
    entry_date = _parse_entry_date(data.get("date"))
    if entry_date is None:
        return jsonify({"error": "Invalid date; use YYYY-MM-DD"}), 400

    sleep = data.get("sleep")
    water = data.get("water")
    steps = data.get("steps")
    mood = data.get("mood")

    if sleep is not None and not isinstance(sleep, (int, float)):
        return jsonify({"error": "sleep must be a number"}), 400
    if water is not None and not isinstance(water, (int, float)):
        return jsonify({"error": "water must be a number"}), 400
    if steps is not None:
        if not isinstance(steps, int) or isinstance(steps, bool):
            return jsonify({"error": "steps must be an integer"}), 400
    if mood is not None and not isinstance(mood, str):
        return jsonify({"error": "mood must be a string"}), 400

    user = db.session.get(User, g.current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    existing = HealthEntry.query.filter_by(user_id=g.current_user_id, date=entry_date).first()
    if existing:
        if sleep is not None:
            existing.sleep = float(sleep)
        if water is not None:
            existing.water = float(water)
        if steps is not None:
            existing.steps = int(steps)
        if mood is not None:
            existing.mood = mood.strip() if mood else None
        update_user_streak(user, entry_date)
        db.session.commit()
        return jsonify({"message": "Entry updated", "entry": existing.to_dict()}), 200

    entry = HealthEntry(
        user_id=g.current_user_id,
        sleep=float(sleep) if sleep is not None else None,
        water=float(water) if water is not None else None,
        steps=int(steps) if steps is not None else None,
        mood=mood.strip() if isinstance(mood, str) and mood.strip() else None,
        date=entry_date,
    )
    db.session.add(entry)
    update_user_streak(user, entry_date)
    db.session.commit()
    return jsonify({"message": "Entry created", "entry": entry.to_dict()}), 201


@health_bp.get("/history")
@token_required
def history():
    limit = request.args.get("limit", default=50, type=int)
    if limit < 1 or limit > 200:
        return jsonify({"error": "limit must be between 1 and 200"}), 400

    entries = (
        HealthEntry.query.filter_by(user_id=g.current_user_id)
        .order_by(HealthEntry.date.desc())
        .limit(limit)
        .all()
    )

    oldest = (
        db.session.query(func.min(HealthEntry.date))
        .filter(HealthEntry.user_id == g.current_user_id)
        .scalar()
    )
    newest = (
        db.session.query(func.max(HealthEntry.date))
        .filter(HealthEntry.user_id == g.current_user_id)
        .scalar()
    )

    return jsonify(
        {
            "entries": [e.to_dict() for e in entries],
            "count": len(entries),
            "date_range": {
                "oldest": oldest.isoformat() if oldest else None,
                "newest": newest.isoformat() if newest else None,
            },
        }
    )
