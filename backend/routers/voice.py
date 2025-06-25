import traceback
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Optional
from pydantic import BaseModel
from external_integrations.voice_service import VoiceService
from middleware.auth import verify_api_key_demo
import io
import base64
import json

router = APIRouter(prefix="/voice", tags=["voice"])
voice_service = VoiceService()

class VoiceSettings(BaseModel):
    language: str = "en"
    voice_gender: str = "female"
    style: str = "calm"

# Wellness disclaimer for voice responses
VOICE_WELLNESS_DISCLAIMER = """
Note: This is a wellness and self-improvement conversation. For medical concerns, please consult a healthcare provider.
"""

@router.post("/process")
async def process_voice(
    audio: UploadFile = File(...),
    settings: str = Form(None),
    context: Optional[str] = Form(None),
    api_key = Depends(verify_api_key_demo)
):
    """
    Process voice input and return AI response with TTS for wellness support.
    """
    try:
        # Read audio file
        audio_data = await audio.read()
        
        # Parse settings JSON string
        settings_obj = VoiceSettings.parse_raw(settings) if settings else VoiceSettings()
        
        # Parse context JSON string
        context_list = json.loads(context) if context else None
        
        # Process voice session with wellness focus
        result = await voice_service.process_voice_session(
            audio_data,
            language=settings_obj.language,
            voice_gender=settings_obj.voice_gender,
            style=settings_obj.style,
            context=context_list
        )
        
        # Add wellness disclaimer to AI response if it's substantial
        ai_response = result["ai_response"]
        if len(ai_response) > 100:
            ai_response += VOICE_WELLNESS_DISCLAIMER
        
        # Return audio response as streaming response
        audio_b64 = base64.b64encode(result["audio_response"]).decode("utf-8")
        return JSONResponse({
            "audio": audio_b64,
            "transcribed_text": result["transcribed_text"],
            "ai_response": ai_response
        })
        
    except Exception as e:
        print("Voice processing error:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/supported-languages")
async def get_supported_languages():
    """
    Get list of supported languages and their voices for wellness sessions.
    """
    return voice_service.supported_languages

@router.get("/voice-styles")
async def get_voice_styles():
    """
    Get available voice styles and their parameters for wellness support.
    """
    return voice_service.voice_styles 