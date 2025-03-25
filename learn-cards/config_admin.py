from learncards import file_managment

def add_admin_by_name(name):
    cur, conn = file_managment.open_db()
    query = "INSERT INTO admins (user_id) VALUES ((SELECT user_id FROM users WHERE username = ?));"
    cur.execute(query, (name,))
    print(f"Added {name} as admin")
    print_all_admins(cur)
    conn.commit()
    conn.close()


def add_admin_by_id(id):
    cur, conn = file_managment.open_db()
    query = "INSERT INTO admins (user_id) VALUES (?);"
    cur.execute(query, (id,))
    print(f"Added {id} as admin")
    print_all_admins(cur)
    conn.commit()
    conn.close()
    
    
def print_all_admins(cur):
    query = """
    SELECT users.user_id, users.username
    FROM admins
    JOIN users ON admins.user_id = users.user_id
    """
    cur.execute(query)
    admins = cur.fetchall()
    print("Current admins:")
    for admin in admins:
        print(f"user_id: {admin[0]}, username: {admin[1]}")


# add_admin_by_id(number)
# add_admin_by_name("Name")