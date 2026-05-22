import os
import sys

from passlib.context import CryptContext
from sqlalchemy.orm import Session

import models
from database import Base, SessionLocal, engine

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def main() -> int:
    email = os.environ.get("ADMIN_EMAIL") or os.environ.get("INITIAL_ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD") or os.environ.get("INITIAL_ADMIN_PASSWORD")

    if not email or not password:
        print("ERRO: defina ADMIN_EMAIL e ADMIN_PASSWORD (ou INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD).")
        return 1

    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:  # type: Session
        existing = db.query(models.User).filter(models.User.email == email).first()
        if existing:
            print(f"Usuário administrador já existe: {email}")
            return 0

        admin_user = models.User(
            email=email,
            hashed_password=get_password_hash(password),
            is_admin=True,
        )
        db.add(admin_user)
        db.commit()
        print(f"Administrador criado com sucesso: {email}")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
