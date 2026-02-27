import os
from tools.search import search
from datetime import date
from lib.client import client
from tools.tools import TOOLS

def run_skeptic(product: str, owns: str|None = None, context: dict = {}, emit=None) -> dict:
    thinking_steps = []
    searches = []
    search_count = 0


    messages = [
        {"role": "user", "content": f"Analyze this product: {product}"}
    ]
    
    OWNS_CONTEXT = f"""
    The user currently owns: {owns}.
    Frame your analysis in the context of their existing ownership. Scruitinize the Advocate's case for any weaknesses that are especially relevant given what the user already owns. Also scruitinize whether the upgrade is actually worth it vs keeping the existing product.
    """ if owns else ""

    SYSTEM_PROMPT = f"""You are the Skeptic agent in a product analysis pipeline.

Today's date is {date.today().strftime("%B %d, %Y")}.

{OWNS_CONTEXT}
The Advocate has already built the case FOR buying this product:
---
{context.get("advocate", "No prior analysis available.")}
---

Your job is to find what they missed. Search specifically for:
- Reddit complaints, owner forums, failure reports
- Durability issues, long-term problems
- What owners regret after buying
- Claims the Advocate made that don't hold up under scrutiny

Do not repeat anything the Advocate already covered. Only find the weaknesses.
Only 7 searches maximum.
Search one query at a time. After each result, reason about what you found and what to look for next before searching again. 
Never batch multiple searches at once.
Write 2-3 paragraphs. No headers, no bullets, no markdown. Plain prose, every sentence cited.
"""

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            system=SYSTEM_PROMPT,
            messages=messages,
            tools=TOOLS,
            max_tokens=2048
        )

        # Always append what the model said to the conversation history
        messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason == "end_turn":
            # Done! Extract and return text.
            for block in response.content:
                if hasattr(block, "text"):
                    if emit:
                        emit({"type": "analysis", "agent": "skeptic", "text": block.text})
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
                    print(f"[Skeptic thinking] {block.text}")
                    if emit:
                        emit({"type": "step", "agent": "skeptic", "step": {"type": "think", "text": block.text}})
                if block.type == "tool_use":
                    search_count += 1
                    if search_count > 7:
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": "Search limit reached. Write your final analysis now."
                        })
                        continue
                    print(f"[Skeptic] Searching: {block.input['query']}")
                    if emit:
                        emit({"type": "step", "agent": "skeptic", "step": {"type": "search", "query": block.input["query"]}})
                    result = search(block.input["query"])
                    searches.append({"query": block.input["query"], "result": result})
                    if search_count == 7:
                        result += "\n\nYou have enough information. Write your final analysis now."
                        if emit:
                            emit({"type": "writing_start", "agent": "skeptic"})
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
    result = run_skeptic(product)
    print("\n --- Thinking ---")
    for step in result["thinking_steps"]:
        print(f" > {step}\n")

    print("\n --- Analysis ---")
    print(result["analysis"])

    print(f"\n --- Searches ({len(result['searches'])}) ---")
    for s in result["searches"]:
        print(f"  - {s['query']}")