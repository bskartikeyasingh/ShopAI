from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str = Field(..., json_schema_extra={"example": "Find a coding laptop under 60000"})
    sellerContext: Optional[Dict[str, Any]] = None
    role: Optional[str] = "customer"

class ProductEvidence(BaseModel):
    id: Optional[str] = None
    _id: Optional[str] = None
    name: str
    price: float
    category: str
    stock: Optional[int] = 0
    imageUrl: Optional[str] = None
    description: Optional[str] = None
    sellerName: Optional[str] = "Verified Merchant"
    reasons: Optional[List[str]] = []

class BundleAction(BaseModel):
    type: str = "ADD_BUNDLE"
    itemCount: int
    totalPrice: float
    productIds: List[str]

class ChatResponse(BaseModel):
    reply: str
    products: List[Dict[str, Any]] = []
    bundleAction: Optional[Dict[str, Any]] = None
    agentsUsed: Optional[List[str]] = []
