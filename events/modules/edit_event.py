from flask import Blueprint, request, jsonify
from modules import create_event, permission, database

edit_event_bp = Blueprint("edit_event", __name__)


@edit_event_bp.route("/data/change/main-event/<event_id>", methods=["POST"])
def edit_event(event_id):
    token = request.cookies.get("token")
    data = request.get_json()

    print(data)

    cur, conn = database.load()
    if not permission.check_access(cur, token, event_id, ""):
        conn.close()
        return jsonify({"error": True})

    rename_event(cur, event_id, data["eventname"])
    delete_subevents(cur, event_id)

    for subevent in data["subevents"]:
        create_event.build_subevent(cur, subevent, event_id)

    conn.commit()
    conn.close()

    return jsonify({"error": False, "eventid": event_id})


@edit_event_bp.route("/data/edit/delete-event", methods=["DELETE"])
def delete_event():
    return "deleting event", 200


def rename_event(cur, event_id, new_name):
    cur.execute(
        "UPDATE main_events SET name = ? WHERE event_id = ?",
        (
            new_name,
            event_id,
        ),
    )


def delete_subevents(cur, event_id):
    cur.execute("DELETE FROM sub_events WHERE event_id = ?", (event_id,))
    cur.execute("DELETE FROM rows WHERE event_id = ?", (event_id,))
