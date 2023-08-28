from pydantic import BaseModel


# schemas.py, TransactionBase
class UserBase(BaseModel):
    username: str

  
# schemas.py
class UserCreate(UserBase):
    password: str


# schemas.py, TransactionModel
class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True