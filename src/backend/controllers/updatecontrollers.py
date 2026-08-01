from backend.utils.db import get_db_cursor


def update_service_session(session_id, reason):
    conn, cursor = get_db_cursor()

    if conn is None:
        return False

    try:
        cursor.execute(
            """
            UPDATE service_sessions
            SET status = %s,
                reason = %s
            WHERE session_id = %s
            """,
            ("Failed", reason, session_id)
        )

        conn.commit()

        return cursor.rowcount > 0

    finally:
        cursor.close()
        conn.close()



def revoke_session(session_id):

    conn, cursor = get_db_cursor()

    if conn is None:
        return False

    try:
        cursor.execute(
            """
            UPDATE login_sessions
            SET revoked_at = CURRENT_TIMESTAMP
            WHERE session_id = %s
            """,
            (session_id,)
        )

        conn.commit()

        return cursor.rowcount > 0

    finally:
        cursor.close()
        conn.close()

# logout for it
# revoke_session(g.session_id)