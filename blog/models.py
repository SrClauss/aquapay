from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(500), nullable=False)
    summary = Column(String(1000), nullable=False)
    content = Column(Text, nullable=False)
    emoji = Column(String(10), nullable=False, default="💧")
    category = Column(String(100), nullable=False, default="Geral")
    author = Column(String(200), nullable=False, default="Equipe Água Pay")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
