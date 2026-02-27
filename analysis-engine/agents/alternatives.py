from tools.search import search
from datetime import date
from lib.client import client

# Two tools: Tavily search + structured submit when done
ALTERNATIVES_TOOLS = [
    {
        "name": "search",
        "description": "Search the web for product alternatives and price comparisons.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "submit_alternatives",
        "description": "Submit the final list of alternative products once you have enough information. Call this when done searching.",
        "input_schema": {
            "type": "object",
            "properties": {
                "alternatives": {
                    "type": "array",
                    "description": "3-5 products consumers commonly consider instead of the original",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name":  {"type": "string", "description": "Product name and model number"},
                            "price": {"type": "string", "description": "Current retail price, e.g. '$199'"},
                            "note":  {"type": "string", "description": "One sentence: key reason to consider this over the original"}
                        },
                        "required": ["name", "price", "note"]
                    },
                    "minItems": 3,
                    "maxItems": 5
                }
            },
            "required": ["alternatives"]
        }
    }
]


def run_alternatives(product: str, emit=None) -> dict:
    searches = []
    search_count = 0

    SYSTEM_PROMPT = f"""You are the Alternatives agent in a product analysis pipeline.
Today's date is {date.today().strftime("%B %d, %Y")}.

Your only job: identify 3-5 products that consumers most commonly compare to — or buy instead of — the {product}.

Search for what people actually consider as alternatives. Focus on:
- Products in the same category and price range
- Commonly mentioned competitors in reviews and comparison articles
- A range of price points where relevant (budget, mid, premium)

You have 3 searches maximum. Be efficient — one broad search often surfaces most candidates.
When done, call submit_alternatives with your findings. Do not write prose analysis.
"""

    messages = [{"role": "user", "content": f"Find the top alternatives to: {product}"}]

    while True:
        response = client.messages.create(
            model="claude-haiku-4-5",
            system=SYSTEM_PROMPT,
            messages=messages,
            tools=ALTERNATIVES_TOOLS,
            max_tokens=1024
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            return {"alternatives": [], "searches": searches}

        elif response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type != "tool_use":
                    continue

                if block.name == "search":
                    search_count += 1
                    print(f"[Alternatives] Searching: {block.input['query']}")
                    result = search(block.input["query"])
                    searches.append({"query": block.input["query"], "result": result})
                    if search_count >= 3:
                        result += "\n\nYou have enough information. Call submit_alternatives now."
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })

                elif block.name == "submit_alternatives":
                    print(f"[Alternatives] Done — {len(block.input['alternatives'])} alternatives found")
                    if emit:
                        emit({"type": "alternatives", "data": block.input["alternatives"]})
                    return {
                        "alternatives": block.input["alternatives"],
                        "searches": searches
                    }

            messages.append({"role": "user", "content": tool_results})

        else:
            return {"alternatives": [], "searches": searches}


if __name__ == "__main__":
    product = "Sony WH-1000XM5 Headphones"
    result = run_alternatives(product)
    print(f"\n--- Alternatives ({len(result['alternatives'])}) ---")
    for alt in result["alternatives"]:
        print(f"  {alt['name']} · {alt['price']}")
        print(f"    {alt['note']}")
