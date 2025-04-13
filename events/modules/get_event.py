from flask import Blueprint, request, jsonify
from modules import database

get_event_bp = Blueprint("get_event", __name__)


@get_event_bp.route("/data/get/event-list", methods=["GET"])
def get_events():
    event_list = get_list_of_all_events()
    return event_list


@get_event_bp.route("/data/get/main-event", methods=["GET"])
def get_event():
    return "surving event", 200


@get_event_bp.route("/data/get/sub-event", methods=["GET"])
def get_sub_event():
    return "surving sub-event", 200


def get_list_of_all_events():
    cur, conn = database.load()

    # get events from database
    cur.execute("SELECT name, event_id FROM main_events")
    res = cur.fetchall()

    event_list = []  # empty list

    for event in res:
        start_date, end_date = get_start_and_end_date_of_event(
            cur, event[1] # event_id
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
    return event_list # return list for the client


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
        (event_id,)
    )
    return cur.fetchone()[0]  # earlyest start_date


def get_end_date_from_event(cur, event_id):
    # sort to find MAX
    cur.execute(
        """SELECT MAX(start_date) AS latest_start_date
        FROM sub_events
        WHERE event_id = ?;
        """,
        (event_id,)
    )
    return cur.fetchone()[0]  # latest start_date