from flask import Blueprint, request, jsonify
from modules import database, permission

create_event_bp = Blueprint("create_event", __name__)


@create_event_bp.route("/data/create/main-event", methods=["POST"])
def create_event():
    data = request.get_json()

    # create rows for every subevent and subevent-row
    event_id = build_new_event(data)
    return {"eventid": event_id}


@create_event_bp.route("/data/create/sub-event/<event_id>", methods=["POST"])
def create_sub_event(event_id):
    subevent = request.get_json()
    token = request.cookies.get("token")
    
    cur, conn = database.load()
    if not permission.check_access(cur, token, event_id, ""):
        conn.close()
        return jsonify({"error": "no permission"})
    
    build_subevent(cur, subevent, event_id)
    
    conn.commit()
    conn.close()
    
    return jsonify({"eventid": event_id})


def build_new_event(data):
    cur, conn = database.load()

    # create table row with pin and name for new event
    event_id = create_event(cur, data["eventname"], data["pin"])

    # create rows for every subevent and every subevent-row
    for subevent in data["subevents"]:
        build_subevent(cur, subevent, event_id)
    
    conn.commit()
    conn.close()
    
    return event_id


def create_event(cur, event_name, pin):
    cur.execute("INSERT INTO main_events (name, pin) VALUES (?, ?)", (event_name, pin))
    return cur.lastrowid


def build_subevent(cur, subevent, event_id):
    # create subevent table row
    subevent_id = create_subevent(cur, subevent, event_id)
    
    # create row in table for every row in subevents
    for row in subevent["rows"]:
        create_subevent_row(cur, row, event_id, subevent_id)


def create_subevent(cur, subevent, event_id):
    # insert new data
    query = """
        INSERT INTO sub_events 
        (event_id, name, start_date, end_date)
        VALUES (?, ?, ?, ?)
    """
    cur.execute(
        query,
        (
            event_id,
            subevent["subeventname"],
            subevent["startdate"],
            subevent["enddate"],
        ),
    )
    return cur.lastrowid # return the id for the rows


def create_subevent_row(cur, row, event_id, subevent_id):
    query = """
        INSERT INTO rows 
        (event_id, subevent_id, name, context)
        VALUES (?, ?, ?, ?)
    """
    
    # insert all ids, name and context
    cur.execute(
        query,
        (
            event_id,
            subevent_id,
            row["rowname"],
            row["rowcontext"],
        ),
    )
    return cur.lastrowid