from datetime import date
from lib.client import client

# No Tavily — synthesis only. Forces a single structured tool call.
VERDICT_TOOL = [
    {
        "name": "submit_verdict",
        "description": "Submit the final verdict for this product analysis.",
        "input_schema": {
            "type": "object",
            "properties": {
                "decision": {
                    "type": "string",
                    "enum": ["BUY", "WAIT", "CONSIDER ALTERNATIVES", "SKIP", "YOU DON'T NEED IT"],
                    "description": (
                        "BUY: strong case, fair price, no major red flags. "
                        "WAIT: good product but current price is meaningfully above the recent low. "
                        "CONSIDER ALTERNATIVES: a specific better-value product exists that avoids the Skeptic's primary concern. "
                        "SKIP: fundamental problems (legal, structural, safety) that outweigh benefits regardless of price. "
                        "YOU DON'T NEED IT: the user already owns a product that covers this use case, or the purchase is redundant given their existing setup — regardless of the product's quality or price."
                    )
                },
                "confidence": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Confidence in this verdict (1-100). Higher when the three agents strongly agree."
                },
                "reasoning": {
                    "type": "string",
                    "description": "2-3 sentences explaining the verdict. Reference specific findings from the agents — name the lawsuit, the price, the alternative."
                },
                "alternative": {
                    "type": "string",
                    "description": "CONSIDER ALTERNATIVES only: exact product name and price, e.g. 'Bose QuietComfort (2024) · $199 from Bose.com'. Omit for all other verdicts."
                },
                "bullets": {
                    "type": "array",
                    "description": "Exactly 3 short bullet points (max 12 words each) summarising the key findings that drove this verdict. Draw from specific facts named by the agents — prices, ratings, failure modes, alternatives.",
                    "items": {"type": "string"},
                    "minItems": 3,
                    "maxItems": 3
                }
            },
            "required": ["decision", "confidence", "reasoning", "bullets"]
        }
    }
]


def run_orchestrator(product: str, owns:str|None = None, context: dict = {}) -> dict:
    
    OWNS_CONTEXT = f"""
    The user currently owns: {owns}.
    Frame your analysis in the context of their existing ownership. For example, if they already own an older version of the same product, they may be more inclined to upgrade. If they own a competing product, they may be more inclined to switch if the new product addresses a key weakness of their current one. But be careful to ensure the Advocate's case is still strong on its own merits, and that the Skeptic's concerns are not dismissed just because the user might already own a version of the product.
    """ if owns else ""
    
    
    SYSTEM_PROMPT = f"""You are the Orchestrator in a product analysis pipeline.
Today's date is {date.today().strftime("%B %d, %Y")}.

{OWNS_CONTEXT}

Three specialized agents have analyzed the {product}:

ADVOCATE — the case FOR buying:
---
{context.get("advocate", "No analysis available.")}
---

SKEPTIC — weaknesses and problems found:
---
{context.get("skeptic", "No analysis available.")}
---

ECONOMIST — price timing and value alternatives:
---
{context.get("economist", "No analysis available.")}
---

Synthesize these three perspectives into one decisive verdict. Call submit_verdict immediately.

Decision criteria:
- BUY: the Advocate's case is compelling, the Skeptic found no major structural issues, and the Economist confirms the price is fair
- WAIT: good product but current price is meaningfully above the Economist's documented recent low
- CONSIDER ALTERNATIVES: a specific product named by the Economist exists at a lower price and avoids the Skeptic's primary concern
- SKIP: the Skeptic identified fundamental problems (active litigation, structural failure, safety) that override the Advocate's case
- YOU DON'T NEED IT: the user already owns something that covers this use case — use this when the owns context makes the purchase redundant, not when the product itself is bad

Confidence reflects how clearly the three analyses converge. Be decisive — do not hedge.
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": "Synthesize the three analyses and submit your verdict."}],
        tools=VERDICT_TOOL,
        tool_choice={"type": "tool", "name": "submit_verdict"},
        max_tokens=512
    )

    for block in response.content:
        if block.type == "tool_use" and block.name == "submit_verdict":
            verdict = block.input
            print(f"[Orchestrator] {verdict['decision']} ({verdict['confidence']}% confidence)")
            return {
                "decision":    verdict["decision"],
                "confidence":  verdict["confidence"],
                "reasoning":   verdict["reasoning"],
                "alternative": verdict.get("alternative"),
                "bullets":     verdict.get("bullets", []),
            }

    # Fallback — should not happen with tool_choice forced
    return {
        "decision": "SKIP",
        "confidence": 0,
        "reasoning": "Orchestrator failed to produce a verdict.",
        "alternative": None,
    }


if __name__ == "__main__":
    product = "Sony WH-1000XM5 Headphones"
    result = run_orchestrator(product, context={
        "advocate": "Strong ANC, Wirecutter upgrade pick, 30h battery, LDAC codec at 990kbps.",
        "skeptic": "Active class action lawsuit over hinge fractures under normal use. Does not fold flat. LDAC and multipoint are mutually exclusive.",
        "economist": "Currently $398, above 90-day low of $248. Bose QuietComfort 2024 at $199 from Bose.com avoids the hinge issue and folds compactly."
    })
    print(f"\nVerdict:    {result['decision']} ({result['confidence']}%)")
    print(f"Reasoning:  {result['reasoning']}")
    if result.get("alternative"):
        print(f"Consider:   {result['alternative']}")
