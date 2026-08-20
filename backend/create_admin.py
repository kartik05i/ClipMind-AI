from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.core.roles import ADMINISTRATOR

db = SessionLocal()

try:
    existing_admin = (
        db.query(User)
        .filter(User.email == "admin@example.com")
        .first()
    )

    if existing_admin:
        print("Admin already exists")

    else:
        admin = User(
            name="Admin",
            email="admin@example.com",
            hashed_password=hash_password("Admin@123"),
            role=ADMINISTRATOR,
            is_active=True
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print(
            f"Administrator created successfully! ID: {admin.id}"
        )

finally:
    db.close()