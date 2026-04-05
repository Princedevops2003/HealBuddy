from datetime import datetime, timezone
from functools import wraps

import jwt
from flask import current_app, g, jsonify, request


def generate_access_token(user_id: int) -> str:
    exp = datetime.now(timezone.utc) + current_app.config["JWT_EXPIRATION"]
    payload = {
        "sub": str(user_id),
        "exp": exp,
        "iat": datetime.now(timezone.utc),
    }
    token = jwt.encode(
        payload,
        current_app.config["JWT_SECRET"],
        algorithm="HS256",
    )
    if isinstance(token, bytes):
        return token.decode("utf-8")
    return token


def token_required(view_fn):
    @wraps(view_fn)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization header must be Bearer <token>"}), 401
        token = auth_header[7:].strip()
        if not token:
            return jsonify({"error": "Missing token"}), 401
        try:
            payload = jwt.decode(
                token,
                current_app.config["JWT_SECRET"],
                algorithms=["HS256"],
            )
            g.current_user_id = int(payload["sub"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return view_fn(*args, **kwargs)

    return wrapped
