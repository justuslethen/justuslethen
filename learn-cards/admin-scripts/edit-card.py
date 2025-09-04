from learncards import file_managment

find_options = ["Via ID", "Via name", "Via front", "Via back"]
actions = ["edit name", "edit front", "edit back"]


def print_options(options):
    for i in range(len(options)):
        option = options[i]
        print(f"({i}) {option}")


def get_way_to_find_card():
    print()
    input_correct = False
    value = ""
    while not input_correct:
        print("How do you want to find the card?")
        print_options(find_options)
        value = input("Select one option:")

        if int(value) in range(len(find_options)):
            input_correct = True
    return int(value)


def search_cards(cur, option):
    column = ""

    # skip 0 because it has its own function
    if option == 1:
        column = "name"
    if option == 2:
        column = "front"
    if option == 3:
        column = "back"

    value = input("Type in your search:")

    if option == 0:
        return get_card_by_id(cur, value)
    else:
        return get_cards_by_column(cur, column, value)


def get_card_by_id(cur, id):
    cur.execute("SELECT id, name, back, front FROM cards WHERE id = ?", (id,))
    res = cur.fetchone()
    if res is None:
        print(f"No card found with id {id}")
        return []
    return [{
        "id": res[0],
        "name": res[1],
        "back": res[2],
        "front": res[3],
    }]


def get_cards_by_column(cur, column, value):
    cur.execute(f"SELECT id, name, back, front FROM cards WHERE {column} LIKE ?", (f"%{value}%",))
    res = cur.fetchall()
    cards = []
    for i in res:
        cards.append(
            {
                "id": i[0],
                "name": i[1],
                "back": i[2],
                "front": i[3],
            }
        )

    return cards


def pick_from_found_cards(cards):
    print()
    print("Found cards:")
    for i in range(len(cards)):
        card = cards[i]
        print(f"({i}) {card['name']}")
        print(f"id: {card['id']}")
        print(f"front: {card['front']}")
        print(f"back: {card['back']}")
        print()

    input_valid = False
    index = 0
    while not input_valid:
        index = int(input("Choose your cards via number:"))
        if index in range(len(cards)):
            input_valid = True

    return cards[index]["id"]


def get_action():
    print()
    input_correct = False
    action = ""
    while not input_correct:
        print("What do you want to do?")
        print_options(actions)
        action = input("Select one option:")

        if int(action) in range(len(actions)):
            input_correct = True

    return int(action)


def edit_card(cur, card_id, action):
    column = ""

    if action == 0:
        column = "name"
    elif action == 1:
        column = "front"
    elif action == 2:
        column = "back"

    value = input("Change it to:")
    cur.execute(f"UPDATE cards SET {column} = ? WHERE id = ?", (value, card_id))


while True:
    cur, conn = file_managment.open_db()

    way_to_find_card = get_way_to_find_card()
    found_cards = search_cards(cur, way_to_find_card)
    
    if len(found_cards) > 0:
        card_id = pick_from_found_cards(found_cards)
        action = get_action()
        edit_card(cur, card_id, action)

    conn.commit()
    conn.close()
