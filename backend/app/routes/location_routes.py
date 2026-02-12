from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from .. import db
from ..models import User

location_bp = Blueprint("location", __name__, url_prefix="/api/location")


@location_bp.route("/select", methods=["POST", "OPTIONS"])

def select_location():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    label = data.get("label")
    lat = data.get("lat")
    lng = data.get("lng")

    if not label:
        return jsonify({"message": "label is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user.location_label = label
    user.location_lat = lat
    user.location_lng = lng
    db.session.commit()

    return jsonify(
        {
            "message": "Location saved",
            "location": {"label": user.location_label, "lat": user.location_lat, "lng": user.location_lng},
        }
    ), 200
