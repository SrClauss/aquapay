from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    is_admin: bool = False


class UserOut(UserBase):
    id: int
    is_admin: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AuthLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class LeadBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=50)
    message: str = Field(..., min_length=5, max_length=2000)
    source: str = Field("web", max_length=200)


class LeadCreate(LeadBase):
    pass


class LeadOut(LeadBase):
    id: int
    read: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PostBase(BaseModel):
    slug: str = Field(..., min_length=3, max_length=255, pattern=r"^[a-z0-9-]+$")
    title: str = Field(..., min_length=3, max_length=500)
    summary: str = Field(..., min_length=10, max_length=1000)
    content: str = Field(..., min_length=10)
    emoji: str = Field("💧", max_length=10)
    category: str = Field("Geral", max_length=100)
    author: str = Field("Equipe Água Pay", max_length=200)
    hero_image_url: Optional[str] = Field(None, max_length=1000)


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=500)
    summary: Optional[str] = Field(None, min_length=10, max_length=1000)
    content: Optional[str] = Field(None, min_length=10)
    hero_image_url: Optional[str] = Field(None, max_length=1000)
    emoji: Optional[str] = Field(None, max_length=10)
    category: Optional[str] = Field(None, max_length=100)
    author: Optional[str] = Field(None, max_length=200)


class PostOut(PostBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PostList(BaseModel):
    total: int
    page: int
    per_page: int
    posts: list[PostOut]
