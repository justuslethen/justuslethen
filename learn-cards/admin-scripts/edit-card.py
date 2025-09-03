from learncards import file_managment

find_options = ["Via ID", "Via name", "Via front", "Via back"]


def get_action():
    input_correct = False
    value = ""
    while not input_correct:
        print("How do you want to find the card?")
        print_options(find_options)
        value = input("Select one option:")

        if int(value) in range(len(find_options)):
            input_correct = True


def print_options(options):
    for option, i in options:
        print(f"({i}) {option}")


while True:
    cur, conn = file_managment.open_db()

    action = get_action()
    conn.commit()
    conn.close()
