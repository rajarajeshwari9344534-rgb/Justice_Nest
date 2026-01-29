from db.session import engine
from sqlalchemy import text

def force_recreate_messages():
    sql = """
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        lawyer_id INTEGER NOT NULL REFERENCES lawyers(id),
        sender_role VARCHAR NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
    );
    """
    with engine.connect() as conn:
        print("Executing manual table creation...")
        conn.execute(text(sql))
        conn.commit()
        print("✅ 'messages' table created (or already exists).")

if __name__ == "__main__":
    force_recreate_messages()
