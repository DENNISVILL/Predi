"""
Security Utilities
JWT token generation, password hashing, and authentication helpers
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
import secrets
import string

from config import settings

# ============================================
# Password Hashing
# ============================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password
    
    Args:
        plain_password: Plain text password
        hashed_password: Bcrypt hashed password
        
    Returns:
        bool: True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password
        
    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)


# ============================================
# JWT Token Generation
# ============================================
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Data to encode in the token (usually {"sub": user_email})
        expires_delta: Optional expiration time override
        
    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def create_refresh_token(data: Dict[str, Any]) -> str:
    """
    Create a JWT refresh token (longer expiration)
    
    Args:
        data: Data to encode in the token
        
    Returns:
        str: Encoded JWT refresh token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and verify a JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        dict: Decoded token payload, or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def verify_token(token: str, token_type: str = "access") -> Optional[str]:
    """
    Verify a JWT token and extract the subject (email)
    
    Args:
        token: JWT token string
        token_type: Expected token type ("access" or "refresh")
        
    Returns:
        str: Email from token, or None if invalid
    """
    payload = decode_token(token)
    
    if not payload:
        return None
    
    # Check token type
    if payload.get("type") != token_type:
        return None
    
    email: str = payload.get("sub")
    return email


# ============================================
# Random Token Generation
# ============================================
def generate_random_token(length: int = 32) -> str:
    """
    Generate a random secure token
    
    Args:
        length: Length of the token
        
    Returns:
        str: Random token
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_verification_token() -> str:
    """
    Generate an email verification token
    
    Returns:
        str: Verification token
    """
    return generate_random_token(64)


def generate_reset_token() -> str:
    """
    Generate a password reset token
    
    Returns:
        str: Reset token
    """
    return generate_random_token(64)


# ============================================
# API Key Generation
# ============================================
def generate_api_key() -> str:
    """
    Generate an API key for external integrations
    
    Returns:
        str: API key
    """
    prefix = "pk_"  # predix key
    random_part = secrets.token_urlsafe(32)
    return f"{prefix}{random_part}"


# ============================================
# Password Strength Checker
# ============================================
def check_password_strength(password: str) -> Dict[str, Any]:
    """
    Check password strength and return detailed feedback
    
    Args:
        password: Password to check
        
    Returns:
        dict: Strength analysis with score and suggestions
    """
    score = 0
    feedback = []
    
    # Length check
    if len(password) >= 8:
        score += 25
    else:
        feedback.append("Password should be at least 8 characters")
    
    if len(password) >= 12:
        score += 10
    
    # Character variety
    if any(c.isupper() for c in password):
        score += 20
    else:
        feedback.append("Add uppercase letters")
    
    if any(c.islower() for c in password):
        score += 20
    else:
        feedback.append("Add lowercase letters")
    
    if any(c.isdigit() for c in password):
        score += 15
    else:
        feedback.append("Add numbers")
    
    if any(c in string.punctuation for c in password):
        score += 10
        feedback.append("Great! You used special characters")
    else:
        feedback.append("Consider adding special characters (!@#$%)")
    
    # Strength rating
    if score >= 80:
        strength = "strong"
    elif score >= 60:
        strength = "medium"
    else:
        strength = "weak"
    
    return {
        "score": score,
        "strength": strength,
        "feedback": feedback
    }
