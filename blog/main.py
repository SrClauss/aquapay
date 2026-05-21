import os

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

import models
import schemas
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


# ------------------------------------------------------------------ #
#  Health                                                             #
# ------------------------------------------------------------------ #

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "service": "blog"}


# ------------------------------------------------------------------ #
#  Posts — public read endpoints                                     #
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


@app.get("/categories", tags=["posts"])
def list_categories(db: Session = Depends(get_db)):
    """Lista todas as categorias com contagem de posts."""
    from sqlalchemy import func

    rows = (
        db.query(models.Post.category, func.count(models.Post.id).label("count"))
        .group_by(models.Post.category)
        .all()
    )
    return [{"category": row.category, "count": row.count} for row in rows]


# ------------------------------------------------------------------ #
#  Posts — write endpoints                                           #
# ------------------------------------------------------------------ #

@app.post(
    "/posts",
    response_model=schemas.PostOut,
    status_code=status.HTTP_201_CREATED,
    tags=["posts"],
)
def create_post(post_in: schemas.PostCreate, db: Session = Depends(get_db)):
    """Cria um novo post no blog."""
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
    slug: str, post_in: schemas.PostUpdate, db: Session = Depends(get_db)
):
    """Atualiza um post existente pelo slug."""
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
def delete_post(slug: str, db: Session = Depends(get_db)):
    """Remove um post pelo slug."""
    post = db.query(models.Post).filter(models.Post.slug == slug).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post com slug '{slug}' não encontrado.",
        )
    db.delete(post)
    db.commit()
