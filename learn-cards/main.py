from flask import Flask, request, send_file, jsonify, make_response, redirect
from learncards import registrate, login, file_managment, token_managment, user_data, render, card_data, learn_session, admin

app = Flask(__name__)


@app.route("/", methods=["GET"])
def redirect_to_card_list():
    return redirect("/card-list")


@app.route("/login", methods=["GET"])
def send_login_page():
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)
    conn.close()

    if user_id:
        return redirect("/")
    else:
        path = file_managment.get_file("login.html")
        return send_file(path)


@app.route("/registration", methods=["GET"])
def send_registration_page():
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)
    conn.close()

    if user_id:
        return redirect("/")
    else:
        path = file_managment.get_file("registration.html")
        return send_file(path)
        

@app.route("/file/<filename>", methods=["GET"])
def send_frontend_file(filename):
    path = file_managment.get_file(filename)
    return send_file(path)


@app.route("/login", methods=["POST"])
def login_user():
    data = request.json["data"]
    cur, conn = file_managment.open_db()

    if user_data.does_username_exist(cur, data["username"]):
        # get the user_id by the passwort and username
        user_id = login.is_password_correct(cur, data["password"], data["username"])
        if user_id:
            # return the created token
            token = token_managment.new_login_token(cur, user_id)
            
            # sets the token cockie for the client without delete date
            response = make_response(jsonify({"message": "successfull logged in"}))
            response.set_cookie("token", token, expires="Tue, 1 Feb 9999 00:00:00 GMT")
            conn.commit()
            conn.close()
            return response
        else:
            conn.close()
            return jsonify({"message": "incorrect password"})
    else:
        conn.close()
        return jsonify({"message": "user does not exist"})


@app.route("/registration", methods=["POST"])
def registrate_user():
    data = request.json["data"]
    cur, conn = file_managment.open_db()
    
    # returning False means that no error was found in the data
    res = registrate.registrate_new_user(cur, data["username"], data["password"])
    if res:
        conn.close()
        return jsonify({"message": res})
    else:
        conn.commit()
        conn.close()
        return jsonify({"message": "successfull created new account"})


@app.route("/<folder_id>/card-list", methods=["GET"])
def send_card_list_page(folder_id):
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id:
        file = render.render_card_list(cur, folder_id, user_id)
        conn.close()
        return file
    else:
        conn.close()
        return redirect("/login")
    
0
@app.route("/folder/<folder_id>", methods=["GET"])
def send_folder_list_page(folder_id):
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id:
        file = render.render_folder_list(cur, folder_id)
        conn.close()
        return file
    else:
        conn.close()
        return redirect("/login")


@app.route("/edit-card-list", methods=["GET"])
def send_edit_card_list_page():
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id and admin.is_user_admin(cur, user_id):
        file = render.render_edit_card_list(cur)
        conn.close()
        return file
    else:
        conn.close()
        return redirect("/login")


@app.route("/delete-card/<card_id>", methods=["GET"])
def delete_card(card_id):
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id and admin.is_user_admin(cur, user_id):
        card_data.delete_card(cur, card_id)
        conn.commit()
        conn.close()
        return redirect("/edit-card-list")
    else:
        conn.close()
        return redirect("/login")


@app.route("/edit-user-list", methods=["GET"])
def send_edit_user_list_page():
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id and admin.is_user_admin(cur, user_id):
        file = render.render_edit_user_list(cur)
        conn.close()
        return file
    else:
        conn.close()
        return redirect("/login")


@app.route("/delete-user/<id_to_delete>", methods=["GET"])
def delete_user(id_to_delete):
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id and admin.is_user_admin(cur, user_id):
        user_data.delete_user(cur, id_to_delete)
        conn.commit()
        conn.close()
        return redirect("/edit-user-list")
    else:
        conn.close()
        return redirect("/login")


@app.route("/card/<card_id>", methods=["GET"])
def send_card_view_page(card_id):
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id:
        file = render.render_card_view(cur, card_id)
        conn.close()
        return file
    else:
        conn.close()
        return redirect("/login")


@app.route("/create-card", methods=["GET"])
def send_create_card_page():
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id:
        path = file_managment.get_file("create_card.html")
        return send_file(path)
    else:
        conn.close()
        return redirect("/login")


@app.route("/add-card", methods=["POST"])
def add_new_card():
    data = request.json["data"]
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)
    
    if user_id:
        # returning False means that no error was found in the data
        res = card_data.add_card(cur, user_id, data["card_name"], data["front"], data["back"])
        conn.commit()
        conn.close()
        if res:
            return jsonify({"message": res})
        else:
            return jsonify({"message": "successfull created new card"})
    else:
        conn.close()
        return jsonify({"message": "pleace log in"})


@app.route("/learn-session", methods=["GET"])
def start_learn_session():
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)
    print(f"user_id: {user_id}")

    if user_id:
        key = learn_session.create_new_session(cur, user_id)
        conn.commit()
        conn.close()
        return redirect(f"/learn-session/{key}")
    else:
        conn.close()
        return redirect("/")


@app.route("/learn-session/<session_key>", methods=["GET"])
def get_card_learn_session(session_key):
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id:
        file = learn_session.next_card(cur, user_id, session_key)
        conn.commit()
        conn.close()
        return file
    else:
        conn.close()
        return redirect("/")


@app.route("/learn-session-finished", methods=["GET"])
def send_finished_session_page():
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id:
        file = render.render_finished_session(cur, user_id)
        conn.close()
        return file
    else:
        conn.close()
        return redirect("/login")


@app.route("/admin", methods=["GET"])
def send_admin_page():
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id and admin.is_user_admin(cur, user_id):
        path = file_managment.get_file("admin.html")
        conn.close()
        return send_file(path)
    else:
        conn.close()
        return redirect("/")


@app.route("/learn-data/<target_id>", methods=["GET"])
def send_learn_data(target_id):
    cur, conn = file_managment.open_db()
    token = request.cookies.get("token")
    user_id = token_managment.does_token_exist(cur, token)

    if user_id and admin.is_user_admin(cur, user_id):
        file = render.render_learn_data_table(cur, target_id)
        conn.close()
        return file
    else:
        conn.close()
        return redirect("/")



if __name__ == "__main__":
    cur, conn = file_managment.open_db()
    file_managment.create_route_folder(cur)
    
    conn.commit()
    conn.close()
    
    app.run(host="0.0.0.0", port=4211, debug=True)
