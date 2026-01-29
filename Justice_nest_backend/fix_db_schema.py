from db.session import engine, Base
from sqlalchemy import text

def reset_messages_table():
    with engine.connect() as conn:
        print("Dropping 'messages' table...")
        conn.execute(text("DROP TABLE IF EXISTS messages CASCADE"))
        conn.commit()
        print("Table dropped successfully.")
    
    print("Recreating all tables...")
    # This will recreate all missing tables, including the fresh 'messages' table
    Base.metadata.create_all(bind=engine)
    print("Database schema updated! Please restart your backend server.")

if __name__ == "__main__":
    reset_messages_table()
