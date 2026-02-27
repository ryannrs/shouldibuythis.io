import os
from tools.search import search
from datetime import date
from lib.client import client
from tools.tools import TOOLS

def run_economist(product: str, owns: str|None = None, context: dict = {}, emit=None) -> dict:
    thinking_steps = []
    searches = []
    search_count = 0


    messages = [
        {"role": "user", "content": f"Analyze this product: {product}"}
    ]
    
    OWNS_CONTEXT = f"""

    The user currently owns: {owns}, frame your analysis based on the value proposition of buying this product given what they already have. Factor in possible re-sale or trade in value of their existing product as well.

    """ if owns else ""

    SYSTEM_PROMPT = f"""You are the Economist agent in a product analysis pipeline.

Today's date is {date.today().strftime("%B %d, %Y")}.

{OWNS_CONTEXT}
The Advocate made the case FOR buying:
---
{context.get("advocate", "No prior analysis available.")}
---

The Skeptic identified these weaknesses:
---
{context.get("skeptic", "No prior analysis available.")}
---

Your job is to answer two questions with evidence:
1. Is the current price a good time to buy, or should the buyer wait for a better deal?
   Find the current price, the 90-day low, and any predictable sale windows. If waiting makes sense, name an exact price alert threshold.
2. What are the 1-2 best-value alternatives at different price points that specifically address the Skeptic's primary concerns?
   Name exact products with exact current prices. One concrete reason each avoids the identified weakness.

Search for: current price vs 90-day history, competing products with current prices, value comparisons.
Search one query at a time. After each result, reason about what you found and what to look for next before searching again.
Never batch multiple searches at once. 7 searches maximum.
Write 2-3 paragraphs. No headers, no bullets, no markdown. Plain prose, every price cited.
Do NOT give a final BUY/WAIT/SKIP verdict — the Orchestrator makes that call. End with price and value findings only.
"""

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            system=SYSTEM_PROMPT,
            messages=messages,
            tools=TOOLS,
            max_tokens=4096
        )

        # Always append what the model said to the conversation history
        messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason == "end_turn":
            # Done! Extract and return text.
            for block in response.content:
                if hasattr(block, "text"):
                    if emit:
                        emit({"type": "analysis", "agent": "economist", "text": block.text})
                    return {
                        "analysis": block.text,
                        "thinking_steps": thinking_steps,
                        "searches": searches
                            }

        elif response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if hasattr(block, "text") and block.text:
                    thinking_steps.append(block.text) # capture thinking steps
                    print(f"[Economist thinking] {block.text}")
                    if emit:
                        emit({"type": "step", "agent": "economist", "step": {"type": "think", "text": block.text}})
                if block.type == "tool_use":
                    search_count += 1
                    if search_count > 7:
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": "Search limit reached. Write your final analysis now."
                        })
                        continue
                    print(f"[Economist] Searching: {block.input['query']}")
                    if emit:
                        emit({"type": "step", "agent": "economist", "step": {"type": "search", "query": block.input["query"]}})
                    result = search(block.input["query"])
                    searches.append({"query": block.input["query"], "result": result})
                    if search_count == 7:
                        result += "\n\nYou have enough information. Write your final analysis now."
                        if emit:
                            emit({"type": "writing_start", "agent": "economist"})
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })
            messages.append({"role": "user", "content": tool_results}) # type: ignore

        elif response.stop_reason == "max_tokens":
            for block in response.content:
                if hasattr(block, "text"):
                    return {
                        "analysis": block.text,
                        "thinking_steps": thinking_steps, 
                        "searches": searches
                    }

        else:
            return {"analysis": "", "thinking_steps": thinking_steps, "searches": searches}  # Unexpected stop reason, end the loop

    

if __name__ == "__main__":
    product = "Sony WH-1000XM5 Headphones"
    result = run_economist(product)
    print("\n --- Thinking ---")
    for step in result["thinking_steps"]:
        print(f" > {step}\n")

    print("\n --- Analysis ---")
    print(result["analysis"])

    print(f"\n --- Searches ({len(result['searches'])}) ---")
    for s in result["searches"]:
        print(f"  - {s['query']}")