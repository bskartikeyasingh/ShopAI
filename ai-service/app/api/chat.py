from fastapi import APIRouter, Header, HTTPException
import os
from typing import Optional
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.agents.orchestrator import AgentOrchestrator

router = APIRouter()
INTERNAL_SECRET = os.getenv("ALLOWED_INTERNAL_CALLER", "internal_shared_secret_token")

async def _handle_chat(request: ChatRequest, x_internal_secret: Optional[str] = None):
    if x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized internal service call")

    result = await AgentOrchestrator.process_request(
        user_message=request.message,
        seller_context=request.sellerContext
    )
    return result

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, x_internal_secret: Optional[str] = Header(None)):
    return await _handle_chat(request, x_internal_secret)

@router.post("/ai/chat", response_model=ChatResponse)
async def ai_chat_endpoint(request: ChatRequest, x_internal_secret: Optional[str] = Header(None)):
    return await _handle_chat(request, x_internal_secret)
