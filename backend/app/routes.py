from flask import Blueprint, jsonify

api = Blueprint("api", __name__)

@api.route("/api/health")
def health():
    return jsonify({"status": "backend running"})
