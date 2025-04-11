from flask import Blueprint, request, jsonify

create_event_bp = Blueprint("create_event", __name__)


@create_event_bp.route("/data/create/main-event", methods=["POST"])
def create_event():
    return "creating main event", 200


@create_event_bp.route("/data/create/sub-event", methods=["POST"])
def create_sub_event():
    return "creating sub event", 200