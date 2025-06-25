import os
import json
import asyncio
import edge_tts
import tempfile
import io
from typing import Optional, Dict, Any
from openai import AsyncOpenAI
from pathlib import Path
import soundfile as sf
import numpy as np
from pydub import AudioSegment
import logging
from external_integrations.ollama_service import OllamaService, OllamaServiceError
import re

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.voice_cache = {}
        self.supported_languages = {
            "en": ["en-US-JennyNeural", "en-US-GuyNeural"],  # female, male
            "hi": ["hi-IN-MadhurNeural"],
            "te": ["te-IN-MohanNeural"]
        }
        self.voice_styles = {
            "calm": {"rate": "-10%", "pitch": "-5%"},
            "cheerful": {"rate": "+10%", "pitch": "+5%"},
            "empathetic": {"rate": "-5%", "pitch": "-2%"}
        }
        self.ollama_service = OllamaService()

    async def transcribe_audio(self, audio_data: bytes) -> str:
        """Transcribe audio using OpenAI's Whisper API."""
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file.flush()
                temp_filename = temp_file.name

            # Read file into memory and close it
            with open(temp_filename, "rb") as audio_file:
                file_bytes = audio_file.read()
            os.unlink(temp_filename)

            # Send to OpenAI as BytesIO
            audio_file_obj = io.BytesIO(file_bytes)
            audio_file_obj.name = "audio.wav"  # OpenAI expects a name attribute

            transcription = await self.openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file_obj
            )
            return transcription.text
        except Exception as e:
            logger.error(f"Error in transcription: {str(e)}")
            raise

    async def generate_tts(self, 
                          text: str, 
                          language: str = "en",
                          voice_gender: str = "female",
                          style: str = "calm") -> bytes:
        """Generate TTS using Edge TTS with specified parameters."""
        try:
            # Select voice based on language and gender
            voices = self.supported_languages.get(language, self.supported_languages["en"])
            voice = voices[0] if voice_gender == "female" else voices[-1]
            
            # For MVP, use plain text to avoid SSML being spoken aloud
            communicate = edge_tts.Communicate(text, voice)
            
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
                await communicate.save(temp_file.name)
                temp_filename = temp_file.name

            # Read the generated audio
            with open(temp_filename, "rb") as audio_file:
                audio_data = audio_file.read()

            os.unlink(temp_filename)
            return audio_data
            
        except Exception as e:
            logger.error(f"Error in TTS generation: {str(e)}")
            raise

    def clean_ai_response(self, text):
        # Remove lines starting with / or system-like commands
        cleaned = re.sub(r'^/.*$', '', text, flags=re.MULTILINE)
        # Remove markdown formatting
        cleaned = re.sub(r'[\*_#>`~]', '', cleaned)
        # Remove extra whitespace
        cleaned = cleaned.strip()
        return cleaned

    async def process_voice_session(self,
                                  audio_data: bytes,
                                  language: str = "en",
                                  voice_gender: str = "female",
                                  style: str = "calm",
                                  context: list = None) -> Dict[str, Any]:
        """Process a complete voice session: transcribe, get AI response, and generate TTS."""
        try:
            # Step 1: Transcribe audio
            transcribed_text = await self.transcribe_audio(audio_data)

            # Step 2: Build prompt with context if provided
            system_prompt = (
                "You are a compassionate therapist. Only reply with helpful, conversational text. "
                "Do not include any commands, markdown, or system tokens."
            )
            if context and isinstance(context, list) and len(context) > 0:
                # Format context as chat history
                chat_history = ""
                for turn in context:
                    if turn.get('role') == 'user':
                        chat_history += f"User: {turn.get('content','')}\n"
                    elif turn.get('role') == 'assistant':
                        chat_history += f"Therapist: {turn.get('content','')}\n"
                chat_history += f"User: {transcribed_text}\nTherapist:"
                prompt = f"{system_prompt}\n{chat_history}"
            else:
                prompt = f"{system_prompt}\nUser: {transcribed_text}"

            ai_response_obj = await self.ollama_service.generate_response(
                prompt=prompt
            )
            ai_response = self.clean_ai_response(ai_response_obj.response)

            # Step 3: Generate TTS for the response
            tts_audio = await self.generate_tts(
                ai_response,
                language=language,
                voice_gender=voice_gender,
                style=style
            )

            return {
                "transcribed_text": transcribed_text,
                "ai_response": ai_response,
                "audio_response": tts_audio
            }

        except OllamaServiceError as e:
            logger.error(f"Ollama service error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error in voice session processing: {str(e)}")
            raise 