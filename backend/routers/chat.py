from fastapi import APIRouter, Depends, HTTPException, Security, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List
import logging
from datetime import datetime
import uuid
from external_integrations.ollama_service import OllamaService, OllamaServiceError
from middleware.auth import verify_api_key
from models.chat import ChatMessage, ChatSession
from database import get_db

router = APIRouter(prefix="/chat", tags=["chat"])
logger = logging.getLogger(__name__)

# Initialize services
ollama_service = OllamaService()

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    context: Optional[list] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    created_at: datetime

class MessageResponse(BaseModel):
    message_id: str
    role: str
    content: str
    timestamp: datetime

# Wellness disclaimer to be included in AI responses
WELLNESS_DISCLAIMER = """
\n\n---
*Note: HealMind AI is a wellness and self-improvement tool designed to support your personal growth and stress management. It is not a substitute for professional medical or mental health care. If you are experiencing mental health concerns, please consult with a qualified healthcare provider.*
"""

@router.post("/message", response_model=ChatResponse)
async def chat_message(
    request: ChatRequest,
    db: Session = Depends(get_db),
    api_key: str = Security(verify_api_key),
    fastapi_request: Request = None
):
    """
    Process a chat message and return AI response for wellness support.
    """
    try:
        # Get or create session
        session_id = request.session_id or str(uuid.uuid4())
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        
        if not session:
            user_email = fastapi_request.headers.get("X-User-Email")
            session = ChatSession(session_id=session_id, user_id=user_email)
            db.add(session)
            db.commit()
            db.refresh(session)

        # Create user message
        user_message = ChatMessage(
            session_id=session_id,
            role="user",
            content=request.message
        )
        db.add(user_message)

        # Build prompt with wellness-focused context
        if request.context:
            # context is a list of {role, content}
            history = "\n".join([f"{m['role']}: {m['content']}" for m in request.context])
            prompt = f"This is a wellness and self-improvement conversation between a user and an AI wellness companion. The AI provides guidance for personal growth, stress management, and mindfulness. It does not provide medical advice, diagnosis, or treatment.\n{history}\nAI:"
        else:
            prompt = f"This is a wellness and self-improvement conversation. The AI provides guidance for personal growth, stress management, and mindfulness. It does not provide medical advice, diagnosis, or treatment.\n\nUser: {request.message}\nAI:"

        # Generate AI response
        ai_response = await ollama_service.generate_response(
            prompt=prompt,
            context=None
        )

        # Add wellness disclaimer to response (only for longer responses)
        response_text = ai_response.response
        if len(response_text) > 100:  # Only add disclaimer for substantial responses
            response_text += WELLNESS_DISCLAIMER

        # Create AI message
        ai_message = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=response_text
        )
        db.add(ai_message)
        db.commit()

        return ChatResponse(
            response=response_text,
            session_id=session_id,
            created_at=datetime.utcnow()
        )

    except OllamaServiceError as e:
        logger.error(f"Ollama service error: {str(e)}")
        raise HTTPException(status_code=503, detail="AI service temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/sessions/{session_id}", response_model=List[MessageResponse])
async def get_chat_history(
    session_id: str,
    db: Session = Depends(get_db),
    api_key: str = Security(verify_api_key)
):
    """
    Retrieve chat history for a specific wellness session.
    """
    session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Wellness session not found")
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.timestamp).all()
    
    return [
        MessageResponse(
            message_id=msg.message_id,
            role=msg.role,
            content=msg.content,
            timestamp=msg.timestamp
        )
        for msg in messages
    ]

@router.get("/copilot-summary/{session_id}")
async def copilot_summary(session_id: str, db: Session = Depends(get_db), api_key: str = Security(verify_api_key)):
    """
    Generate a live summary and insights for a wellness session using AI.
    """
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.timestamp).all()
    if not messages:
        raise HTTPException(status_code=404, detail="No messages found for this session")
    chat_text = "\n".join([f"{m.role}: {m.content}" for m in messages])
    prompt = (
        "You are an expert wellness copilot. Summarize this wellness session in 2-3 sentences and provide 2 actionable insights for the user's personal growth and stress management.\n"
        f"Session transcript:\n{chat_text}\n"
        "Summary and insights:"
    )
    ai_response = await ollama_service.generate_response(prompt)
    return {"summary": ai_response.response}

@router.get("/sessions")
async def list_sessions(db: Session = Depends(get_db), api_key: str = Security(verify_api_key)):
    """
    List all wellness sessions for the user, with summary and metadata.
    """
    sessions = db.query(ChatSession).order_by(ChatSession.created_at.desc()).all()
    result = []
    for s in sessions:
        # Get last message for summary
        last_msg = db.query(ChatMessage).filter(ChatMessage.session_id == s.session_id).order_by(ChatMessage.timestamp.desc()).first()
        summary = last_msg.content if last_msg else ''
        result.append({
            "session_id": s.session_id,
            "created_at": s.created_at,
            "summary": summary,
            "wellness_type": s.session_metadata.get("therapy") if s.session_metadata else None,
            "user_id": s.user_id
        })
    return result 