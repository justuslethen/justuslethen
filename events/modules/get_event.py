from flask import Blueprint, request, jsonify

get_event_bp = Blueprint("get_event", __name__)


@get_event_bp.route("/data/get/event-list", methods=["GET"])
def get_events():
    return "surving events", 200


@get_event_bp.route("/data/get/main-event", methods=["GET"])
def get_event():
    return "surving event", 200


@get_event_bp.route("/data/get/sub-event", methods=["GET"])
def get_sub_event():
    return "surving sub-event", 200