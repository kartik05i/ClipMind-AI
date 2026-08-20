from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):

    name: str

    email: EmailStr

    password: str

    role: str


class ForgotPasswordRequest(BaseModel):

    email: EmailStr


class ResetPasswordRequest(BaseModel):

    email: EmailStr

    new_password: str