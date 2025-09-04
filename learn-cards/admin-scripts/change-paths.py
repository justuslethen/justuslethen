from learncards import file_managment

def get_all_folders(cur):
    cur.execute("SELECT folder_id, path, name FROM folders")
    res = cur.fetchall()
    folders = []
    
    for i in res:
        folders.append({
            "folder_id": i[0],
            "path": i[1],
            "name": i[2],
        })
    
    return folders


def change_folder_path(cur, value, folder_id):
    cur.execute("UPDATE folders SET path = ? WHERE folder_id = ?", (value, folder_id,))
    print("success")


if __name__ == "__main__":
    cur, conn = file_managment.open_db()
    folders = get_all_folders(cur)
    
    for i in folders:
        new_path = input(f"Change path: {i["path"]} to:")
        change_folder_path(cur, new_path, i["folder_id"])
    
    conn.commit()
    conn.close()