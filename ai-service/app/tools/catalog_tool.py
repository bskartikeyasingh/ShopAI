from motor.motor_asyncio import AsyncIOMotorClient
import os
import re

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017/shopagent")
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database()

async def search_catalog(query: str, max_price: float = None, category: str = None, limit: int = 4):
    """Grounds searches directly in MongoDB records with zero hallucinations."""
    filter_dict = {"active": True, "stock": {"$gt": 0}}

    if max_price:
        filter_dict["price"] = {"$lte": max_price}

    if category:
        filter_dict["category"] = category.lower()

    # Regex token search matching name or description
    keywords = [re.escape(w) for w in query.split() if len(w) > 2]
    if keywords:
        regex_pattern = "|".join(keywords)
        filter_dict["$or"] = [
            {"name": {"$regex": regex_pattern, "$options": "i"}},
            {"description": {"$regex": regex_pattern, "$options": "i"}}
        ]

    cursor = db["products"].find(filter_dict).limit(limit)
    docs = await cursor.to_list(length=limit)
    
    formatted = []
    for d in docs:
        formatted.append({
            "id": str(d["_id"]),
            "name": d.get("name", ""),
            "price": float(d.get("price", 0)),
            "stock": int(d.get("stock", 0)),
            "category": d.get("category", ""),
            "attributes": d.get("attributes", {})
        })
    return formatted
