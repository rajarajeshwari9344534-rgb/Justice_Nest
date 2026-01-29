from pydantic import BaseModel, EmailStr
from typing import Optional

class LawyerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone_number: str
    city: Optional[str]
    gender: Optional[str]
    specialization: Optional[str]
    years_of_experience: float
    id_proof_url : str
    photo_url: str
    fees_range: str
    
    status: str

    class Config:
        from_attributes = True

class LawyerLogin(BaseModel):
    email: EmailStr
    password: str
