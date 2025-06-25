from fastapi import Security, HTTPException, status, Request
from fastapi.security import APIKeyHeader
import os
import logging
from typing import Optional
import hashlib
import time

logger = logging.getLogger(__name__)

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

DEMO_KEY = "DEMO_KEY_123"

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests = {}

    def is_rate_limited(self, api_key: str) -> bool:
        current_time = time.time()
        minute_ago = current_time - 60

        # Clean up old requests
        self.requests = {
            k: v for k, v in self.requests.items()
            if v > minute_ago
        }

        # Count requests in the last minute
        recent_requests = sum(1 for t in self.requests.values() if t > minute_ago)
        
        if recent_requests >= self.requests_per_minute:
            return True

        # Add new request
        self.requests[api_key] = current_time
        return False

rate_limiter = RateLimiter()

def verify_api_key(api_key: Optional[str] = Security(api_key_header)) -> str:
    """
    Verify the API key and check rate limits.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key is missing"
        )

    # Get valid API keys from environment
    valid_keys = os.getenv("API_KEYS", "").split(",")
    
    # Hash the provided API key for comparison
    hashed_key = hashlib.sha256(api_key.encode()).hexdigest()
    
    if hashed_key not in valid_keys:
        logger.warning(f"Invalid API key attempt: {api_key[:8]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )

    # Check rate limits
    if rate_limiter.is_rate_limited(hashed_key):
        logger.warning(f"Rate limit exceeded for API key: {api_key[:8]}...")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        )

    return api_key

async def verify_api_key_demo(request: Request):
    auth = request.headers.get("Authorization")
    if not auth or auth != f"Bearer {DEMO_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized") 