from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, health
import os

app = FastAPI(title="ShopAgent AI Multi-Agent Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(health.router, prefix="/api")

@app.get("/api/health")
def root_health_check():
    return {"status": "ok", "service": "ShopAgent AI FastApi Worker"}
