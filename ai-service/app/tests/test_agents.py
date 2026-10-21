import pytest
from app.agents.orchestrator import AgentOrchestrator

def test_extract_budget():
    assert AgentOrchestrator.extract_budget("Find a coding laptop under 60000") == 60000.0
    assert AgentOrchestrator.extract_budget("Looking for accessories below ₹5,000") == 5000.0
    assert AgentOrchestrator.extract_budget("Budget 45000 for development machine") == 45000.0
    assert AgentOrchestrator.extract_budget("Coding setup under 75k") == 75000.0
    assert AgentOrchestrator.extract_budget("Show me all mechanical keyboards") is None

@pytest.mark.anyio
async def test_process_request_empty_catalog():
    result = await AgentOrchestrator.process_request("SuperNonExistentCategoryItem12345")
    assert "reply" in result
    assert result["products"] == []
    assert "Orchestrator" in result["agentsUsed"]
    assert "ProductAgent" in result["agentsUsed"]

@pytest.mark.anyio
async def test_process_shopping_query_bundle():
    result = await AgentOrchestrator.process_request("Coding setup under 70,000")
    assert "reply" in result
    assert len(result["products"]) >= 2
    assert result["bundleAction"] is not None
    assert result["bundleAction"]["type"] == "ADD_BUNDLE"
    assert result["bundleAction"]["itemCount"] == len(result["products"])
    assert result["bundleAction"]["totalPrice"] <= 70000.0
    assert len(result["bundleAction"]["productIds"]) == len(result["products"])
