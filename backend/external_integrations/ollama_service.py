import httpx
import logging
from typing import Dict, Optional
from pydantic import BaseModel
import os
from tenacity import retry, stop_after_attempt, wait_exponential
import json

logger = logging.getLogger(__name__)

class OllamaResponse(BaseModel):
    response: str
    model: str
    created_at: str
    done: bool

class OllamaService:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = "mistral"
        self.timeout = 30.0
        self.max_retries = 3

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def generate_response(
        self,
        prompt: str,
        context: Optional[Dict] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> OllamaResponse:
        """
        Generate a response using the Ollama Mistral model.
        
        Args:
            prompt (str): The input prompt
            context (Optional[Dict]): Additional context for the model
            temperature (float): Controls randomness (0.0 to 1.0)
            max_tokens (int): Maximum number of tokens to generate
            
        Returns:
            OllamaResponse: The model's response
            
        Raises:
            OllamaServiceError: If the request fails
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
                
                if context:
                    payload["context"] = context

                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                )
                
                response.raise_for_status()
                response_text = response.text
                lines = response_text.strip().splitlines()
                full_response = ""
                last_obj = {}
                for line in lines:
                    try:
                        obj = json.loads(line)
                        if obj.get('response'):
                            full_response += obj['response']
                        last_obj = obj
                    except Exception:
                        continue
                if not full_response:
                    full_response = ""
                if not last_obj:
                    last_obj = {"response": ""}
                last_obj['response'] = full_response
                
                return OllamaResponse(
                    response=last_obj["response"],
                    model=last_obj.get("model", self.model),
                    created_at=last_obj.get("created_at", ""),
                    done=last_obj.get("done", True)
                )
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error occurred: {str(e)}")
            raise OllamaServiceError(f"Failed to generate response: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise OllamaServiceError(f"Unexpected error occurred: {str(e)}")

class OllamaServiceError(Exception):
    """Custom exception for Ollama service errors"""
    pass 