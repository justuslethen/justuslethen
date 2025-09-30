from learncards import card_data, file_managment, user_data, admin, folders
from flask import render_template_string
from datetime import datetime

def render_card_list(cur, folder_id, user_id):
    list = card_data.get_card_list(cur, user_id, folder_id)
    
    content = ""
    
    for item in list:
        content += f"""
        <a class="item" href="/card/{item["id"]}">
            <div class="card_name">
                <p>{item['name']}</p>
            </div>
            <div class="next_learn">
                <p>{item['next_time_to_learn']}</p>
            </div>
            <div class="card_creator">
                <p>{item['username']}</p>
            </div>
        </a>
        """
    
    return content


def render_edit_card_list(cur):
    path = file_managment.get_file("edit_card_list.html")
    file = file_managment.open_file(path)
    list = card_data.get_card_list_of_all(cur)
    
    content = ""
    
    for item in list:
        print(f"item: {item}")
        content += f"""
        <div class="item">
            <div class="card_name">
                <p>{item['name']}</p>
            </div>
            <div class="card_creator">
                <p>{item['folder_id']}</p>
            </div>
            <a class="button button_red" href="/delete-card/{item["id"]}">
                Löschen
            </a>
        </div>
        """
    
    file = file.replace("<!--dynamic rendering space-->", f"{content}")
    return render_template_string(file)


def render_edit_user_list(cur):
    path = file_managment.get_file("edit_user_list.html")
    file = file_managment.open_file(path)
    list = user_data.get_user_list(cur)
    
    content = ""
    
    for item in list:
        print(f"item: {item}")
        content += f"""
        <div class="item">
            <div class="name">
                <p>{item['username']}</p>
            </div>
            <div class="id">
                <p>{item['user_id']}</p>
            </div>
            <a class="button button_red" href="/delete-user/{item["user_id"]}">
                Löschen
            </a>
        </div>
        """
    
    file = file.replace("<!--dynamic rendering space-->", f"{content}")
    return render_template_string(file)


def render_card_view(cur, card_id):
    path = file_managment.get_file("card_view.html")
    file = file_managment.open_file(path)
    card = card_data.get_card(cur, card_id)
    front = card['front'].replace("\n", "<br>")
    back = card['back'].replace("\n", "<br>")
    
    next_card, last_card = card_data.get_next_and_last_card_id(cur, card_id)
    
    link_left = f"/card/{last_card}"
    link_right = f"/card/{next_card}"
    
    file = file.replace("<!--dynamic render front-->", front)
    file = file.replace("<!--dynamic render back-->", back)
    file = file.replace("<!--dynamic render card name-->", card["name"])
    file = file.replace("dynamic_render_left_button", link_left)
    file = file.replace("dynamic_render_right_button", link_right)
    
    return render_template_string(file)


def render_learn_card_view(cur, card_id, key1, key2):
    path = file_managment.get_file("learn_view.html")
    file = file_managment.open_file(path)
    card = card_data.get_card(cur, card_id)
    
    front = card['front'].replace("\n", "<br>")
    back = card['back'].replace("\n", "<br>")
    
    button_left = f"""<a class="button button_red" href="/learn-session/key/{key1}">Wusste ich nicht</a>"""
    button_right = f"""<a class="button button_green" href="/learn-session/key/{key2}">Wusste ich</a>"""
    
    file = file.replace("<!--dynamic render front-->", front)
    file = file.replace("<!--dynamic render back-->", back)
    file = file.replace("<!--dynamic render card name-->", card["name"])
    file = file.replace("<!--dynamic render button_left-->", button_left)
    file = file.replace("<!--dynamic render button_right-->", button_right)
    
    return render_template_string(file)


def render_finished_session(cur, user_id, folder_id):
    path = file_managment.get_file("finished_learn_session.html")
    file = file_managment.open_file(path)
    
    file = file.replace("<!--dynamic-rendering-link-->", f"/learn-session/start/{folder_id}")
    
    return render_template_string(file)


def render_learn_data_table(cur, target_id):
    data = admin.get_learn_data_target(cur, target_id)
    
    path = file_managment.get_file("learn_data.html")
    file = file_managment.open_file(path)
    content = ""
    
    for item in data:
        date = datetime.fromtimestamp(item[3]/1000).strftime('%Y-%m-%d %H:%M:%S')
        
        day_dt = datetime.fromtimestamp(item[4]/1000)
        day = day_dt.strftime('%A')
        
        content += f"""
        <tr>
            <td>{item[0]}</td>
            <td>{item[1]}</td>
            <td>{item[2]}</td>
            <td>{"Correct" if item[5] else "Wrong"}</td>
            <td>{item[6]}</td>
            <td>{day}</td>
            <td>{date}</td>
        </tr>
        """

    file = file.replace("<!--dynamic render-->", content)
    
    return render_template_string(file)


def render_folder_list(cur, folder_id, user_id):
    path = file_managment.get_file("folder_list.html")
    file = file_managment.open_file(path)
    list = folders.get_folder_list(cur, folder_id)
    are_cards_in_folder = folders.are_cards_in_folder(cur, folder_id)
    
    content = ""
    
    for item in list:
        print(f"item: {item}")
        content += f"""
        <a class="item" href="/folder/{item["id"]}">
            <div class="card_name">
                <p>{item['name']}</p>
            </div>
        </a>
        """
    
    file = file.replace("<!--dynamic rendering space-->", content)
    file = file.replace("<!--folder id-->", folder_id)
    if are_cards_in_folder:
        btn = f"""<a class="button button_red" href="/learn-session/start/{folder_id}">Stapel lernen</a>"""
        file = file.replace("<!--learn cards btn-->", btn)
        
        card_list = render_card_list(cur, folder_id, user_id)
        file = file.replace("<!--dynamic cards rendering space-->", card_list)
        
    return render_template_string(file)