from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text

# Import our routers
from routers import chat, voice
from database import engine, Base

ROOT_DIR = Path(__file__).parent
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Create the main app
app = FastAPI(
    title="HealMind AI API",
    description="""
    Backend API for HealMind AI - AI-powered wellness and self-improvement platform.
    
    ## Important Notice
    HealMind AI is a wellness and self-improvement tool designed to support personal growth, 
    stress management, and mindfulness practice. It is **not a substitute for professional 
    medical or mental health care**. We do not collect, store, or process medical information, 
    diagnoses, or treatment data. If you are experiencing mental health concerns, please 
    consult with a qualified healthcare provider.
    
    ## Features
    * **Wellness Sessions**: AI-powered conversations for personal growth and stress management
    * **Voice Support**: Real-time voice interactions for wellness guidance
    * **Mood Tracking**: Personal wellness and mood monitoring
    * **Analytics**: Insights into your wellness journey and progress
    """,
    version="1.0.0",
    contact={
        "name": "HealMind AI Support",
        "email": "support@healmind.ai",
    },
    license_info={
        "name": "Proprietary",
        "url": "https://healmind.ai/terms",
    },
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Include our routers
api_router.include_router(chat.router)
api_router.include_router(voice.router)

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {
        "message": "HealMind AI Wellness API",
        "description": "AI-powered wellness and self-improvement platform",
        "disclaimer": "This is a wellness tool, not a substitute for professional medical care",
        "version": "1.0.0"
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    with Session(engine) as session:
        session.add(status_obj)
        session.commit()
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    with Session(engine) as session:
        status_checks = session.execute("SELECT * FROM status_check").fetchall()
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up HealMind AI Wellness API...")
    try:
        # Test database connection
        with Session(engine) as session:
            session.execute(text("SELECT 1"))
        logger.info("Successfully connected to PostgreSQL")
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down HealMind AI Wellness API...")
    try:
        # Close database connection
        with Session(engine) as session:
            session.close()
        logger.info("Successfully closed PostgreSQL connection")
    except Exception as e:
        logger.error(f"Failed to close PostgreSQL connection: {str(e)}")
        raise
