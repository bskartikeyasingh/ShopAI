# ShopAgent: Architecture Blueprint

## System Architecture

ShopAgent is built as a three-tier decoupled distributed system:

```
[ Frontend: React + Vite + Router ]
                │
                ▼ (REST via /api)
[ Express API Gateway & Orchestrator ] ──▶ [ MongoDB Atlas / Local ]
                │
                ▼ (Internal REST + Secret Header)
[ AI Multi-Agent Service: FastAPI ] ──▶ [ MongoDB Grounding / Gemini LLM ]
```

### Components:
1. **Frontend (`frontend/`)**: React 18, Vite, React Router 6, Context API for Auth and Cart state, Lucide icons.
2. **Core Server (`server/`)**: Express REST API handling authentication (JWT + bcrypt), multi-vendor RBAC, atomic MongoDB transactions for order placement and escrow split, and reverse-proxying AI queries.
3. **AI Service (`ai-service/`)**: FastAPI multi-agent worker with agent orchestration, live catalog grounding via Motor (MongoDB async driver), and guardrails against hallucinated stock/pricing.
