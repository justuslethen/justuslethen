from modules import database

def delete_user(sid):
    cur, conn = database.connect_db()
    cur.execute("DELETE FROM users WHERE sid = ?", (sid,))
    conn.commit()
    conn.close()