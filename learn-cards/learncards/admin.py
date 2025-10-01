import time


def is_user_admin(cur, user_id):
    query = """
    SELECT user_id
    FROM admins
    WHERE user_id = ?;
    """
    
    cur.execute(query, (user_id,))
    res = cur.fetchall()
    
    if res:
        return True
    else:
        return False


def get_everyones_learn_data_tuple(cur):
    query = """
    SELECT COALESCE(u.username, 'deleted user') AS username, l.*
    FROM learn_data l
    LEFT JOIN users u ON u.user_id = l.user_id
    """
    cur.execute(query)
    return cur.fetchall()


def get_everyones_logs_tuple(cur):
    query = """
    SELECT 
        COALESCE(u.username, 'deleted user') AS username,
        l.user_id,
        l.log_id,
        l.action,
        l.date
    FROM logs l
    LEFT JOIN users u ON u.user_id = l.user_id
    """
    cur.execute(query)
    return cur.fetchall()


def get_learn_data_target(cur, target_id):
    if target_id == "all":
        return get_everyones_learn_data_tuple(cur)
    else:
        query = """
        SELECT COALESCE(u.username, 'deleted user') AS username, l.*
        FROM learn_data l
        LEFT JOIN users u ON u.user_id = l.user_id
        WHERE l.user_id = ?
        """
        cur.execute(query, (target_id,))
        return cur.fetchall()
    
    
def get_logs_target(cur, target_id):
    if target_id == "all":
        return get_everyones_logs_tuple(cur)
    else:
        query = """
        SELECT 
            COALESCE(u.username, 'deleted user') AS username,
            l.user_id,
            l.log_id,
            l.action,
            l.date
        FROM logs l
        LEFT JOIN users u ON u.user_id = l.user_id
        WHERE l.user_id = ?
        """
        cur.execute(query, (target_id,))
        return cur.fetchall()
    

def write_log(cur, user_id, action):
    date = int(time.time() * 1000)
    
    query = """
    INSERT INTO logs (user_id, date, action)
    VALUES (?, ?, ?);
    """
    
    cur.execute(query, (user_id, date, action))
    cur.connection.commit()