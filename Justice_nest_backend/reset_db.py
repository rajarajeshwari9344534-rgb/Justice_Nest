from db.session import engine, Base
from models.user import User
from models.lawyers import Lawyers
from models.complaint import Complaints

# Drop all tables
Base.metadata.drop_all(bind=engine)
print("✓ Tables dropped")

# Recreate all tables
Base.metadata.create_all(bind=engine)
print("✓ Tables created successfully")
