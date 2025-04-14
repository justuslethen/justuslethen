from flask import Blueprint, request, jsonify
from modules import database, permission

get_event_bp = Blueprint("get_event", __name__)


@get_event_bp.route("/data/get/event-list", methods=["GET"])
def get_events():
    event_list = get_list_of_all_events()
    return event_list


@get_event_bp.route("/data/get/main-event/<event_id>", methods=["GET"])
def get_event(event_id):
    event_data = get_all_event_data(event_id)

    if not permission.check_room_permissions(event_id, ""):
        return {
            "error": "no permission",
            "event": {"eventname": event_data["eventname"]},
        }

    return {"event": event_data, "error": False}


@get_event_bp.route("/data/get/sub-event/<subevent_id>", methods=["GET"])
def get_sub_event(subevent_id):
    return "surving sub-event", 200


def get_list_of_all_events():
    cur, conn = database.load()

    # get events from database
    cur.execute("SELECT name, event_id FROM main_events")
    res = cur.fetchall()

    event_list = []  # empty list

    for event in res:
        start_date, end_date = get_start_and_end_date_of_event(
            cur, event[1]  # event_id
        )  # search with event_id

        # create JSON and add to the list
        event_list.append(
            {
                "name": event[0],
                "eventid": event[1],
                "startdate": start_date,
                "enddate": end_date,
            }
        )
    return event_list  # return list for the client


def get_start_and_end_date_of_event(cur, event_id):
    start_date = get_start_date_from_event(cur, event_id)
    end_date = get_end_date_from_event(cur, event_id)
    return start_date, end_date


def get_start_date_from_event(cur, event_id):
    # sort to find MIN
    cur.execute(
        """SELECT MIN(start_date) AS earliest_start_date
        FROM sub_events
        WHERE event_id = ?;
        """,
        (event_id,),
    )
    return cur.fetchone()[0]  # earlyest start_date


def get_end_date_from_event(cur, event_id):
    # sort to find MAX
    cur.execute(
        """SELECT MAX(end_date) AS latest_end_date
        FROM sub_events
        WHERE event_id = ?;
        """,
        (event_id,),
    )
    return cur.fetchone()[0]  # latest end_date


def get_all_event_data(event_id):
    cur, conn = database.load()
    event_name = get_eventname_by_id(cur, event_id)
    subevents = get_subevents(cur, event_id)

    event_data = {"eventname": event_name, "subevents": subevents}
    conn.close()

    return event_data  # return all important event-data


def get_eventname_by_id(cur, event_id):
    cur.execute("SELECT name FROM main_events WHERE event_id = ?", (event_id,))
    res = cur.fetchone()

    return res[0] if res else False


def get_subevents(cur, event_id):
    cur.execute(
        "SELECT subevent_id, name, start_date, end_date FROM sub_events WHERE event_id = ?",
        (event_id),
    )
    res = cur.fetchall()

    subevents = []

    for subevent in res:
        rows = get_all_rows_for_subevent(cur, subevent[0])
        subevents.append(
            {
                "subeventname": subevent[1],
                "startdate": subevent[2],
                "enddate": subevent[3],
                "rows": rows,
            }
        )

    return subevents


def get_all_rows_for_subevent(cur, subevent_id):
    # select all rows for subevent
    cur.execute("SELECT name, context FROM rows WHERE subevent_id = ?", (subevent_id,))
    res = cur.fetchall()

    rows = []

    for row in res:
        # append row JSON with context and name
        rows.append({"name": row[0], "context": row[1]})

    return rows  # return all rows for subevent
