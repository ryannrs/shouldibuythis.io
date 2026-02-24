import anthropic
import os
from dotenv import load_dotenv
from tools.search import search
from datetime import date
from lib.client import client

TOOLS = [
    {
        "name": "search",
        "description": "Search the web for product reviews, awards, expert opinions, and specifications to gather information about the product.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                }
            },
            "required": ["query"]
        }
        
    }
    
]

def run_advocate(product: str) -> dict:
    thinking_steps = []
    searches = []
    search_count = 0


    messages = [
        {"role": "user", "content": f"Analyze this product: {product}"}
    ]
    
    SYSTEM_PROMPT = f"""You are the Advocate agent in a product analysis pipeline.

    Today's date is {date.today().strftime("%B %d, %Y")}. Prioritize recent sources over older ones.
    Your job is to find and present the strongest factual case FOR buying this product.
    Start with a broad search. After each search, identify the strongest specific claims worth verifying with data. 
    Follow leads. If a reviewer mentions a benchmark score, find it. 
    If a spec claim is made, verify it. Stop when you have enough sourced evidence to make a compelling case — not before.
    Write no more than 3-4 concise paragraphs. No headers, no bullet points, no tables, no markdown. 
    Dense, evidence-rich prose only. Every sentence must cite a source or score.
    You have 10 searches to gather information. Use them wisely.
    Search one query at a time. After each result, reason about what you found and what to look for next before searching again. 
    Never batch multiple searches at once.
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
                if block.type == "tool_use":
                    search_count += 1
                    print(f"[Advocate] Searching: {block.input['query']}")
                    result = search(block.input["query"])
                    searches.append({"query": block.input["query"], "result": result}) # capture searches
                    if search_count >= 10:
                        result += "\n\nYou have enough information. Write your final analysis now."
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
    result = run_advocate(product)
    print("\n --- Thinking ---")
    for step in result["thinking_steps"]:
        print(f" > {step}\n")

    print("\n --- Analysis ---")
    print(result["analysis"])

    print(f"\n --- Searches ({len(result['searches'])}) ---")
    for s in result["searches"]:
        print(f"  - {s['query']}")