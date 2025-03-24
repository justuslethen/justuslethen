from modules import database


# delete the user from the database
# this function is called when the user disconnects
def delete_user(sid):
    cur, conn = database.connect_db()
    
    cur.execute("DELETE FROM users WHERE sid = ?", (sid,))
    
    conn.commit()
    conn.close()