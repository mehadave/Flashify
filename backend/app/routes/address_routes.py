from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from .. import db
from ..models import Address

address_bp = Blueprint("addresses", __name__, url_prefix="/api/addresses")

@address_bp.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        return "", 204

@address_bp.route("", methods=["GET"])
@jwt_required()
def list_addresses():
    user_id = get_jwt_identity()
    addresses = (
        Address.query.filter_by(user_id=user_id)
        .order_by(Address.id.desc())
        .all()
    )
    return jsonify([serialize_address(a) for a in addresses]), 200


@address_bp.route("", methods=["POST"])
@jwt_required()
def create_address():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    required = ["label", "line1", "city", "state", "zip"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    is_default = bool(data.get("is_default", False))
    if is_default:
        Address.query.filter_by(user_id=user_id, is_default=True).update({"is_default": False})

    addr = Address(
        user_id=user_id,
        label=data["label"],
        line1=data["line1"],
        line2=data.get("line2"),
        city=data["city"],
        state=data["state"],
        zip=data["zip"],
        lat=data.get("lat"),
        lng=data.get("lng"),
        is_default=is_default,
    )
    db.session.add(addr)
    db.session.commit()

    return jsonify(serialize_address(addr)), 201


@address_bp.route("/<int:address_id>/default", methods=["PATCH"])
@jwt_required()
def set_default_address(address_id):
    user_id = get_jwt_identity()
    addr = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not addr:
        return jsonify({"message": "Address not found"}), 404

    Address.query.filter_by(user_id=user_id, is_default=True).update({"is_default": False})
    addr.is_default = True
    db.session.commit()

    return jsonify({"message": "Default address updated"}), 200


@address_bp.route("/<int:address_id>", methods=["DELETE"])
@jwt_required()
def delete_address(address_id):
    user_id = get_jwt_identity()
    addr = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not addr:
        return jsonify({"message": "Address not found"}), 404

    db.session.delete(addr)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


def serialize_address(a: Address):
    return {
        "id": a.id,
        "label": a.label,
        "line1": a.line1,
        "line2": a.line2,
        "city": a.city,
        "state": a.state,
        "zip": a.zip,
        "lat": a.lat,
        "lng": a.lng,
        "is_default": a.is_default,
    }