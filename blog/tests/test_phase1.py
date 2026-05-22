import os
import tempfile

import pytest
from fastapi.testclient import TestClient

# Ensure the test database is configured before importing the application
TEST_DB_FILE = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_FILE.name}"
TEST_DB_FILE.close()

from blog.main import app
import blog.main as blog_main
from blog.database import Base, engine, SessionLocal
from blog.models import User
from blog.main import get_password_hash


@pytest.fixture(scope="session", autouse=True)
def initialize_database():
    Base.metadata.create_all(bind=engine)
    yield
    try:
        os.unlink(TEST_DB_FILE.name)
    except OSError:
        pass


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_seed_admin_and_login(client):
    email = "admin@example.com"
    password = "strongpassword"

    # Create initial admin directly in the test DB
    with SessionLocal() as db:
        admin = User(email=email, hashed_password=get_password_hash(password), is_admin=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)

    response = client.post("/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert payload["access_token"]


def test_auth_me_returns_current_user(client):
    email = "admin2@example.com"
    password = "anotherpassword"

    with SessionLocal() as db:
        admin = User(email=email, hashed_password=get_password_hash(password), is_admin=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)

    login = client.post("/auth/login", json={"email": email, "password": password})
    token = login.json()["access_token"]

    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == email
    assert data["is_admin"] is True


def test_create_and_list_users_requires_admin(client):
    admin_email = "superadmin@example.com"
    admin_password = "superpassword"
    user_email = "user@example.com"

    with SessionLocal() as db:
        admin = User(email=admin_email, hashed_password=get_password_hash(admin_password), is_admin=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)

    login = client.post("/auth/login", json={"email": admin_email, "password": admin_password})
    token = login.json()["access_token"]

    response = client.post(
        "/users",
        json={"email": user_email, "password": "userpassword", "is_admin": False},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    user_data = response.json()
    assert user_data["email"] == user_email
    assert user_data["is_admin"] is False

    list_response = client.get("/users", headers={"Authorization": f"Bearer {token}"})
    assert list_response.status_code == 200
    users = list_response.json()
    assert any(u["email"] == user_email for u in users)


def test_delete_user(client):
    admin_email = "admin-delete@example.com"
    admin_password = "deletepassword"
    delete_email = "delete@example.com"

    with SessionLocal() as db:
        admin = User(email=admin_email, hashed_password=get_password_hash(admin_password), is_admin=True)
        user = User(email=delete_email, hashed_password=get_password_hash("deleteuser"), is_admin=False)
        db.add(admin)
        db.add(user)
        db.commit()
        db.refresh(admin)
        db.refresh(user)

    login = client.post("/auth/login", json={"email": admin_email, "password": admin_password})
    token = login.json()["access_token"]

    delete_response = client.delete(
        f"/users/{user.id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_response.status_code == 204

    with SessionLocal() as db:
        assert db.query(User).filter(User.email == delete_email).first() is None


def test_post_crud_requires_admin(client):
    admin_email = "postadmin@example.com"
    admin_password = "postpassword"
    slug = "novo-post"
    hero_image_url = "/media/hero-image.png"

    with SessionLocal() as db:
        admin = User(email=admin_email, hashed_password=get_password_hash(admin_password), is_admin=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)

    login = client.post("/auth/login", json={"email": admin_email, "password": admin_password})
    token = login.json()["access_token"]

    create_response = client.post(
        "/posts",
        json={
            "slug": slug,
            "title": "Post de Teste",
            "summary": "Sumário do post de teste.",
            "content": "Conteúdo do post de teste.",
            "hero_image_url": hero_image_url,
            "emoji": "💧",
            "category": "Testes",
            "author": "Equipe",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert create_response.status_code == 201
    post_data = create_response.json()
    assert post_data["slug"] == slug
    assert post_data["hero_image_url"] == hero_image_url

    get_response = client.get(f"/posts/{slug}")
    assert get_response.status_code == 200
    assert get_response.json()["slug"] == slug

    update_response = client.put(
        f"/posts/{slug}",
        json={"title": "Post Atualizado", "hero_image_url": "/media/hero-image-2.png"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Post Atualizado"
    assert update_response.json()["hero_image_url"] == "/media/hero-image-2.png"

    delete_response = client.delete(
        f"/posts/{slug}", headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_response.status_code == 204

    missing_response = client.get(f"/posts/{slug}")
    assert missing_response.status_code == 404


def test_upload_image_to_minio(client, monkeypatch):
    admin_email = "mediaadmin@example.com"
    admin_password = "mediapassword"

    with SessionLocal() as db:
        admin = User(email=admin_email, hashed_password=get_password_hash(admin_password), is_admin=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)

    login = client.post("/auth/login", json={"email": admin_email, "password": admin_password})
    token = login.json()["access_token"]

    class DummyMinio:
        def __init__(self, endpoint, access_key, secret_key, secure):
            pass

        def bucket_exists(self, bucket):
            return True

        def put_object(self, bucket, object_name, data, length, content_type):
            assert bucket == "aquapay-media"
            assert content_type == "image/png"
            return None

    monkeypatch.setattr(blog_main, "Minio", DummyMinio)

    response = client.post(
        "/upload/image",
        files={"file": ("hero.png", b"dummyimagebytes", "image/png")},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["url"].startswith("/media/")


def test_create_lead_public(client):
    response = client.post(
        "/leads",
        json={
            "name": "João Cliente",
            "email": "joao@example.com",
            "phone": "+5511999999999",
            "message": "Tenho interesse no serviço.",
            "source": "landing",
        },
    )
    assert response.status_code == 201
    payload = response.json()
    assert payload["name"] == "João Cliente"
    assert payload["email"] == "joao@example.com"
    assert payload["source"] == "landing"
    assert payload["read"] is False


def test_list_leads_requires_admin(client):
    admin_email = "leadadmin@example.com"
    admin_password = "leadpassword"

    with SessionLocal() as db:
        admin = User(email=admin_email, hashed_password=get_password_hash(admin_password), is_admin=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)

    login = client.post("/auth/login", json={"email": admin_email, "password": admin_password})
    token = login.json()["access_token"]

    # Create a lead publically
    client.post(
        "/leads",
        json={
            "name": "Maria Cliente",
            "email": "maria@example.com",
            "phone": "+5511988888888",
            "message": "Quero saber mais.",
            "source": "blog",
        },
    )

    list_response = client.get("/leads", headers={"Authorization": f"Bearer {token}"})
    assert list_response.status_code == 200
    leads = list_response.json()
    assert any(lead["email"] == "maria@example.com" for lead in leads)


def test_mark_lead_read(client):
    admin_email = "leadadmin2@example.com"
    admin_password = "leadpassword2"

    with SessionLocal() as db:
        admin = User(email=admin_email, hashed_password=get_password_hash(admin_password), is_admin=True)
        db.add(admin)
        db.commit()
        db.refresh(admin)

    login = client.post("/auth/login", json={"email": admin_email, "password": admin_password})
    token = login.json()["access_token"]

    create_response = client.post(
        "/leads",
        json={
            "name": "Carlos Cliente",
            "email": "carlos@example.com",
            "phone": "+5511977777777",
            "message": "Preciso de uma proposta.",
            "source": "contato",
        },
    )
    lead_id = create_response.json()["id"]

    patch_response = client.patch(
        f"/leads/{lead_id}/read", headers={"Authorization": f"Bearer {token}"}
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["read"] is True
