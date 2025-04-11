from flask import Blueprint, request, jsonify

edit_event_bp = Blueprint("edit_event", __name__)


@edit_event_bp.route("/data/edit/event", methods=["POST"])
def edit_event():
    return "editing event", 200


@edit_event_bp.route("/data/edit/delete-event", methods=["DELETE"])
def delete_event():
    return "deleting event", 200