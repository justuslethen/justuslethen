def get_folder_list(cur, folder_id):
    folder_path = get_inner_folder_path_by_id(cur, folder_id)
    
    list = []
    query = """
    SELECT name, path, folder_id FROM folders WHERE path = ?
    """
    cur.execute(query, (folder_path,))
    res = cur.fetchall()

    for i in res:
        list.append({"name": i[0], "path": i[1], "id": i[2]})

    return list


def get_inner_folder_path_by_id(cur, folder_id):
    query = """
    SELECT name, path FROM folders WHERE folder_id = ?
    """
    cur.execute(query, (folder_id,))
    res = cur.fetchall()
    
    return res[0][0] + "/" + res[0][1]