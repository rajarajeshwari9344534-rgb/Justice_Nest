from db.session import engine, SessionLocal
from models.message import Messages
from sqlalchemy import inspect

def check_db():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables in DB: {tables}")
    
    if "messages" in tables:
        print("✅ 'messages' table exists.")
    else:
        print("❌ 'messages' table MISSING!")

if __name__ == "__main__":
    check_db()
