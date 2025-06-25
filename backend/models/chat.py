from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    session_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String, nullable=True)
    session_metadata = Column(JSON, default={})
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    message_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("chat_sessions.session_id"))
    role = Column(String)  # 'user' or 'assistant'
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    session = relationship("ChatSession", back_populates="messages") 