import io
import os
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, status, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from minio import Minio
from passlib.context import CryptContext
from sqlalchemy.orm import Session

try:
    from . import models, schemas
    from .database import Base, engine, get_db
except ImportError:
    import models, schemas
    from database import Base, engine, get_db

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Água Pay — Blog API",
    description="Backend FastAPI para o blog da plataforma Água Pay.",
    version="1.0.0",
)

# Allowed origins are configured via the ALLOWED_ORIGINS environment variable
# (comma-separated list). Defaults to localhost for development.
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost,http://localhost:3000")
allowed_origins: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-please")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.environ.get("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.environ.get("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET = os.environ.get("MINIO_BUCKET", "aquapay-media")
MINIO_SECURE = os.environ.get("MINIO_SECURE", "false").lower() in ("1", "true", "yes")
MEDIA_URL = os.environ.get("MEDIA_URL", "/media/")


def get_minio_client() -> Minio:
    return Minio(
        endpoint=MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=MINIO_SECURE,
    )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire, "sub": data.get("sub")})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, token_data.email)
    if user is None:
        raise credentials_exception
    return user


def get_current_admin(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso autorizado somente para administradores.",
        )
    return current_user


# ------------------------------------------------------------------ #
#  Health                                                             #
# ------------------------------------------------------------------ #

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": "blog"}


# ------------------------------------------------------------------ #
#  Auth                                                              #
# ------------------------------------------------------------------ #

@app.post("/auth/login", response_model=schemas.Token, tags=["auth"])
def login(auth: schemas.AuthLogin, db: Session = Depends(get_db)):
    """Autentica o usuário e retorna um token JWT."""
    user = authenticate_user(db, auth.email, auth.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha inválidos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me", response_model=schemas.UserOut, tags=["auth"])
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Retorna informações do usuário autenticado."""
    return current_user


# ------------------------------------------------------------------ #
#  Posts — public + admin                                              #
# ------------------------------------------------------------------ #

@app.get("/posts", response_model=schemas.PostList, tags=["posts"])
def list_posts(
    page: int = Query(1, ge=1, description="Número da página"),
    per_page: int = Query(10, ge=1, le=100, description="Posts por página"),
    category: Optional[str] = Query(None, description="Filtrar por categoria"),
    db: Session = Depends(get_db),
):
    """Lista todos os posts do blog com paginação e filtro opcional por categoria."""
    query = db.query(models.Post)
    if category:
        query = query.filter(models.Post.category == category)
    total = query.count()
    posts = (
        query.order_by(models.Post.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return schemas.PostList(total=total, page=page, per_page=per_page, posts=posts)


@app.get("/posts/{slug}", response_model=schemas.PostOut, tags=["posts"])
def get_post(slug: str, db: Session = Depends(get_db)):
    """Retorna um post pelo slug."""
    post = db.query(models.Post).filter(models.Post.slug == slug).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post com slug '{slug}' não encontrado.",
        )
    return post


@app.post(
    "/posts",
    response_model=schemas.PostOut,
    status_code=status.HTTP_201_CREATED,
    tags=["posts"],
)
def create_post(
    post_in: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    """Cria um novo post no blog. Requer token de administrador."""
    existing = db.query(models.Post).filter(models.Post.slug == post_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Já existe um post com o slug '{post_in.slug}'.",
        )
    post = models.Post(**post_in.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@app.put("/posts/{slug}", response_model=schemas.PostOut, tags=["posts"])
def update_post(
    slug: str,
    post_in: schemas.PostUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    """Atualiza um post existente pelo slug. Requer token de administrador."""
    post = db.query(models.Post).filter(models.Post.slug == slug).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post com slug '{slug}' não encontrado.",
        )
    for field, value in post_in.model_dump(exclude_unset=True).items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@app.delete(
    "/posts/{slug}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["posts"],
)
def delete_post(
    slug: str,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    """Remove um post pelo slug. Requer token de administrador."""
    post = db.query(models.Post).filter(models.Post.slug == slug).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post com slug '{slug}' não encontrado.",
        )
    db.delete(post)
    db.commit()


@app.post(
    "/upload/image",
    status_code=status.HTTP_200_OK,
    tags=["media"],
)
async def upload_image(
    file: UploadFile = File(...),
    current_admin: models.User = Depends(get_current_admin),
):
    """Upload de imagem para MinIO. Requer token de administrador."""
    accepted_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in accepted_types:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Tipo de arquivo não suportado.",
        )

    contents = await file.read()
    object_name = f"{uuid.uuid4().hex}{Path(file.filename).suffix or ".png"}"
    client = get_minio_client()
    if not client.bucket_exists(MINIO_BUCKET):
        client.make_bucket(MINIO_BUCKET)

    client.put_object(
        MINIO_BUCKET,
        object_name,
        io.BytesIO(contents),
        length=len(contents),
        content_type=file.content_type,
    )

    url = MEDIA_URL.rstrip("/") + "/" + object_name
    return {"url": url}


# ------------------------------------------------------------------ #
#  Users — admin endpoints                                             #
# ------------------------------------------------------------------ #

@app.post(
    "/users",
    response_model=schemas.UserOut,
    status_code=status.HTTP_201_CREATED,
    tags=["users"],
)
def create_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    """Cria um novo usuário. Requer token de administrador."""
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Já existe um usuário com o email '{user_in.email}'.",
        )
    user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        is_admin=user_in.is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/users", response_model=list[schemas.UserOut], tags=["users"])
def list_users(
    db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)
):
    """Lista todos os usuários. Requer token de administrador."""
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    return users


@app.delete(
    "/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["users"],
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    """Remove um usuário pelo ID. Requer token de administrador."""
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuário com id '{user_id}' não encontrado.",
        )
    db.delete(user)
    db.commit()


# ------------------------------------------------------------------ #
#  Leads — public + admin                                              #
# ------------------------------------------------------------------ #

@app.post(
    "/leads",
    response_model=schemas.LeadOut,
    status_code=status.HTTP_201_CREATED,
    tags=["leads"],
)
def create_lead(lead_in: schemas.LeadCreate, db: Session = Depends(get_db)):
    """Cria um novo lead público."""
    lead = models.Lead(**lead_in.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@app.get("/leads", response_model=list[schemas.LeadOut], tags=["leads"])
def list_leads(
    db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)
):
    """Lista todos os leads. Requer token de administrador."""
    leads = db.query(models.Lead).order_by(models.Lead.created_at.desc()).all()
    return leads


@app.patch("/leads/{lead_id}/read", response_model=schemas.LeadOut, tags=["leads"])
def mark_lead_read(
    lead_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    """Marca um lead como lido. Requer token de administrador."""
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead com id '{lead_id}' não encontrado.",
        )
    lead.read = True
    db.commit()
    db.refresh(lead)
    return lead
