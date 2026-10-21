import os
import json
import httpx
from typing import Dict, Any, List

class GeminiCatalogAssistant:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        )

    async def generate_grounded_response(self, user_prompt: str, candidate_products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Uses Gemini 1.5 Flash to synthesize human-like shopping advice.
        Strict guardrail: The model is instructed ONLY to cite items in candidate_products.
        """
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            # Fallback to deterministic synthesis if API key is not configured
            return {
                "reply": f"Found {len(candidate_products)} verified match(es) for your request.",
                "used_llm": False
            }

        catalog_context = json.dumps([
            {
                "id": str(p.get("id") or p.get("_id", "")),
                "name": p.get("name", ""),
                "price": p.get("price", 0),
                "category": p.get("category", ""),
                "specs": p.get("attributes", {})
            }
            for p in candidate_products
        ])

        system_instruction = (
            "You are the ShopAgent AI Shopping Assistant. "
            "Your task is to recommend products to customers based ONLY on the catalog JSON provided. "
            "NEVER invent products, specs, or prices that do not exist in the catalog context. "
            "If no candidate fits the user's constraints, state clearly that no matching stock is available. "
            "Respond in a helpful, friendly, and concise tone."
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": f"SYSTEM: {system_instruction}\nCATALOG CONTEXT: {catalog_context}\nCUSTOMER PROMPT: {user_prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 300
            }
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                res = await client.post(self.endpoint, json=payload)
                res.raise_for_status()
                data = res.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"reply": reply_text.strip(), "used_llm": True}
            except Exception as e:
                print(f"[Gemini Agent Error]: {e}")
                return {
                    "reply": f"Here are the top {len(candidate_products)} matching items based on our current inventory.",
                    "used_llm": False
                }
