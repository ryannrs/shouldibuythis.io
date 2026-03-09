import os
from tools.search import search
from datetime import date
from lib.client import client
from tools.tools import TOOLS


def run_advocate(product: str, owns: str|None = None, context: dict = {}, emit=None) -> dict:
    thinking_steps = []
    searches = []
    search_count = 0


    messages = [
        {"role": "user", "content": f"Analyze this product: {product}"}
    ]
    
    STATIC_PROMPT = """You are the Advocate agent in a product analysis pipeline.
Your job is to find and present the strongest factual case FOR buying this product.
Start with a broad search. After each search, identify the strongest specific claims worth verifying with data.
Follow leads. If a reviewer mentions a benchmark score, find it.
If a spec claim is made, verify it. Stop when you have enough sourced evidence to make a compelling case — not before.
Write no more than 3-4 concise paragraphs. No headers, no bullet points, no tables, no markdown.
Dense, evidence-rich prose only. Every sentence must cite a source or score.
You have 7 searches to gather information. Use them wisely.
Search one query at a time. After each result, reason about what you found and what to look for next before searching again.
Never batch multiple searches at once."""

    OWNS_CONTEXT = f"\n\nThe user currently owns: {owns}. Frame your case around the upgrade value - what meaningfully improves, what they'd gain that their current product can't provide. If the upgrade is marginal, note it honestly but lean into what's genuinely new." if owns else ""

    DYNAMIC_PROMPT = f"Today's date is {date.today().strftime('%B %d, %Y')}. Prioritize recent sources over older ones.{OWNS_CONTEXT}"

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            system=[
                {"type": "text", "text": STATIC_PROMPT, "cache_control": {"type": "ephemeral"}},
                {"type": "text", "text": DYNAMIC_PROMPT},
            ],
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
                        emit({
                            "type": "analysis",
                            "agent": "advocate",
                            "text": block.text
                        })
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
                    print(f"[Advocate thinking] {block.text}")
                    if emit:
                        emit({
                            "type": "step",
                            "agent": "advocate",
                            "step": {"type": "think", "text": block.text}
                        })
                if block.type == "tool_use":
                    search_count += 1
                    if search_count > 7:
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": "Search limit reached. Write your final analysis now."
                        })
                        continue
                    print(f"[Advocate] Searching: {block.input['query']}")
                    if emit:
                        emit({
                            "type": "step",
                            "agent": "advocate",
                            "step": {"type": "search", "query": block.input["query"]}
                        })
                    result = search(block.input["query"])
                    searches.append({"query": block.input["query"], "result": result})
                    if search_count == 7:
                        result += "\n\nYou have enough information. Write your final analysis now."
                        if emit:
                            emit({"type": "writing_start", "agent": "advocate"})
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })
            if tool_results:
                tool_results[-1]["cache_control"] = {"type": "ephemeral"}
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
    result = run_advocate(product)
    print("\n --- Thinking ---")
    for step in result["thinking_steps"]:
        print(f" > {step}\n")

    print("\n --- Analysis ---")
    print(result["analysis"])

    print(f"\n --- Searches ({len(result['searches'])}) ---")
    for s in result["searches"]:
        print(f"  - {s['query']}")