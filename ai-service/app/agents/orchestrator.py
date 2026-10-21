import re
import os
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017/shopagent")

class AgentOrchestrator:
    """Natural language parsing, multi-product bundle matching, budget constraints, and actionable bundle payloads."""
    
    def __init__(self, db=None):
        self._custom_db = db

    @property
    def db(self):
        if self._custom_db is not None:
            return self._custom_db
        return AsyncIOMotorClient(MONGO_URI).get_database()

    @staticmethod
    def extract_budget(query: str) -> Optional[float]:
        """Extracts numerical budget values like 'under 60000', 'below 50k', 'under ₹1,00,000', 'budget 45000'."""
        if not query:
            return None
        query_lower = query.lower().replace(",", "")
        
        # Check for k suffix (e.g., 60k -> 60000, 75k -> 75000)
        k_match = re.search(r'(?:under|below|budget|within|less than|max)\s*₹?\s*(\d+(?:\.\d+)?)\s*k\b', query_lower)
        if k_match:
            return float(k_match.group(1)) * 1000

        # Check for direct number following keywords or currency symbol
        num_match = re.search(r'(?:under|below|budget|within|less than|max|₹|\$)\s*₹?\s*(\d+)', query_lower)
        if num_match:
            return float(num_match.group(1))
        
        return None

    async def search_catalog(self, query: str, budget: Optional[float] = None) -> List[Dict[str, Any]]:
        """Queries MongoDB for active products matching tokens, filtered by budget and bundle logic."""
        cursor = self.db["products"].find({"active": True, "stock": {"$gt": 0}})
        all_products = await cursor.to_list(length=100)

        # Cache seller store names
        sellers_cursor = self.db["sellers"].find({})
        sellers_list = await sellers_cursor.to_list(length=50)
        seller_map = {str(s["_id"]): s.get("storeName", "Verified Merchant") for s in sellers_list}

        for p in all_products:
            sid = str(p.get("sellerId", ""))
            p["sellerName"] = seller_map.get(sid, "Verified Merchant")

        q_lower = query.lower()
        
        # Check if query indicates bundle/setup request
        bundle_keywords = ["setup", "bundle", "combo", "workstation", "pack", "kit", "essentials", "together", "complete"]
        is_bundle_query = any(k in q_lower for k in bundle_keywords) or (" and " in q_lower) or (" & " in q_lower)

        # Specific item intent detection with word boundaries
        wants_laptop = any(re.search(r'\b' + re.escape(w) + r'\b', q_lower) for w in ["laptop", "computer", "pc", "macbook", "probook", "thinkpro"])
        wants_keyboard = any(re.search(r'\b' + re.escape(w) + r'\b', q_lower) for w in ["keyboard", "keys", "ultracode"])
        wants_mouse = any(re.search(r'\b' + re.escape(w) + r'\b', q_lower) for w in ["mouse", "mice", "precision"])
        wants_audio = any(re.search(r'\b' + re.escape(w) + r'\b', q_lower) for w in ["headphone", "headphones", "audio", "earbud", "earbuds", "microphone", "mic", "sound"])
        wants_monitor = any(re.search(r'\b' + re.escape(w) + r'\b', q_lower) for w in ["monitor", "display", "screen"])

        matched = []

        if is_bundle_query or (wants_laptop and (wants_mouse or wants_keyboard)) or (wants_keyboard and wants_mouse):
            # 1. Coding / Workstation / Student Setup
            if wants_laptop or "coding" in q_lower or "workstation" in q_lower or "student" in q_lower or "setup" in q_lower:
                chosen_laptop = next((p for p in all_products if p.get("category") == "laptops"), None)
                chosen_kb = next((p for p in all_products if "keyboard" in p.get("name", "").lower()), None)
                chosen_mouse = next((p for p in all_products if "mouse" in p.get("name", "").lower()), None)
                
                bundle_candidates = [item for item in [chosen_laptop, chosen_kb, chosen_mouse] if item]
                
                bundle_sum = sum(float(p.get("price", 0)) for p in bundle_candidates)
                if budget is None or bundle_sum <= budget:
                    matched = bundle_candidates
                else:
                    rem_budget = budget
                    for item in bundle_candidates:
                        p_price = float(item.get("price", 0))
                        if p_price <= rem_budget:
                            matched.append(item)
                            rem_budget -= p_price

            # 2. Audio & Streaming Bundle
            elif wants_audio or "headphone" in q_lower or "mic" in q_lower:
                chosen_headphones = next((p for p in all_products if "headphone" in p.get("name", "").lower()), None)
                chosen_mic = next((p for p in all_products if "microphone" in p.get("name", "").lower()), None)
                chosen_earbuds = next((p for p in all_products if "earbud" in p.get("name", "").lower()), None)
                
                audio_candidates = [item for item in [chosen_headphones, chosen_mic] if item]
                audio_sum = sum(float(p.get("price", 0)) for p in audio_candidates)
                if budget is None or audio_sum <= budget:
                    matched = audio_candidates
                elif chosen_headphones and float(chosen_headphones.get("price", 0)) <= budget:
                    matched = [chosen_headphones]
                elif chosen_earbuds and float(chosen_earbuds.get("price", 0)) <= budget:
                    matched = [chosen_earbuds]

            # 3. Keyboard & Mouse Bundle
            elif wants_keyboard or wants_mouse:
                chosen_kb = next((p for p in all_products if "keyboard" in p.get("name", "").lower()), None)
                chosen_mouse = next((p for p in all_products if "mouse" in p.get("name", "").lower()), None)
                km_candidates = [item for item in [chosen_kb, chosen_mouse] if item]
                km_sum = sum(float(p.get("price", 0)) for p in km_candidates)
                if budget is None or km_sum <= budget:
                    matched = km_candidates
                else:
                    matched = [item for item in km_candidates if float(item.get("price", 0)) <= (budget or 999999)]

        # Fallback to keyword matching if not a bundle query or no bundle items matched
        if not matched:
            stopwords = {"find", "need", "want", "show", "give", "best", "some", "good", "laptop", "setup", "under", "below", "budget", "please", "with", "for", "the", "all", "item"}
            tokens = [t.lower() for t in re.findall(r'[a-zA-Z]{3,}', query) if t.lower() not in stopwords]

            if tokens:
                for p in all_products:
                    p_text = f"{p.get('name', '')} {p.get('description', '')} {p.get('category', '')}".lower()
                    if any(t in p_text for t in tokens):
                        if budget is None or float(p.get("price", 0)) <= budget:
                            matched.append(p)

        matched.sort(key=lambda x: float(x.get("price", 0)))
        return matched[:6]

    async def process_shopping_query(self, query: str, user_role: str = "customer") -> Dict[str, Any]:
        agents_used = ["Orchestrator", "ProductAgent", "ComparisonAgent", "RecommendationAgent"]
        budget = self.extract_budget(query)
        matched_products = await self.search_catalog(query, budget)

        formatted_products = []
        for p in matched_products:
            p_price = float(p.get("price", 0))
            reasons = ["In stock", f"Category: {p.get('category', 'general')}"]
            if budget and p_price <= budget:
                reasons.append(f"Within budget (₹{int(budget):,})")
            if p.get("sellerName"):
                reasons.append(f"Seller: {p['sellerName']}")

            formatted_products.append({
                "_id": str(p["_id"]),
                "id": str(p["_id"]),
                "name": p.get("name", "Product"),
                "price": p_price,
                "category": p.get("category", "General"),
                "stock": int(p.get("stock", 0)),
                "imageUrl": p.get("imageUrl", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"),
                "description": p.get("description", ""),
                "sellerName": p.get("sellerName", "Verified Merchant"),
                "reasons": reasons
            })

        total_bundle_price = sum(p["price"] for p in formatted_products)

        if not formatted_products:
            reply = f"I searched our live catalog, but couldn't find any in-stock products matching '{query}'"
            if budget:
                reply += f" under ₹{int(budget):,}."
            else:
                reply += ". Try searching for laptops, keyboards, or headphones!"
            
            return {
                "reply": reply,
                "products": [],
                "bundleAction": None,
                "agentsUsed": agents_used
            }

        if len(formatted_products) == 1:
            item = formatted_products[0]
            reply = f"I found the perfect match for you: **{item['name']}** for ₹{int(item['price']):,}. It is verified in stock from {item['sellerName']} and ready to ship!"
            bundle_action = None
        else:
            reply = f"Here is a curated recommendation of {len(formatted_products)} items"
            if budget:
                reply += f" fitting your budget under ₹{int(budget):,} (Total: ₹{int(total_bundle_price):,})."
            else:
                reply += f" across verified sellers (Total: ₹{int(total_bundle_price):,})."
            reply += " You can add items individually or click 'Add All to Cart' to bundle your order!"

            bundle_action = {
                "type": "ADD_BUNDLE",
                "itemCount": len(formatted_products),
                "totalPrice": total_bundle_price,
                "productIds": [p["_id"] for p in formatted_products]
            }

        return {
            "reply": reply,
            "products": formatted_products,
            "bundleAction": bundle_action,
            "agentsUsed": agents_used
        }

    @classmethod
    async def process_request(cls, user_message: str, seller_context: dict = None) -> Dict[str, Any]:
        """Class method wrapper for backward compatibility with existing tests and API callers."""
        orchestrator = cls()
        return await orchestrator.process_shopping_query(user_message)

ShoppingAgentOrchestrator = AgentOrchestrator
