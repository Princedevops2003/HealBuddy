from datetime import date

from app.models import User


def update_user_streak(user: User, entry_date: date) -> None:
    """
    Update streak when a health entry is saved for `entry_date`.
    - Same calendar day as last_entry_date → no change (new save or edit).
    - Next consecutive day → streak + 1.
    - Gap > 1 day → streak reset to 1.
    - Earlier than last_entry_date → no change (backfill).
    """
    last = user.last_entry_date
    if last is not None and entry_date < last:
        return
    if last is not None and entry_date == last:
        return
    if last is None:
        user.streak_count = 1
        user.last_entry_date = entry_date
        return

    delta = (entry_date - last).days
    if delta == 1:
        user.streak_count = (user.streak_count or 0) + 1
    else:
        user.streak_count = 1
    user.last_entry_date = entry_date
