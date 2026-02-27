import threading
from agents.advocate import run_advocate
from agents.skeptic import run_skeptic
from agents.economist import run_economist
from agents.alternatives import run_alternatives
from agents.orchestrator import run_orchestrator


def run_pipeline(product: str, owns: str | None = None, emit=None) -> dict:
    # Alternatives runs in a background thread — it needs no context from
    # the other agents and is fast (3 searches max), so it runs in parallel.
    alternatives_result = {}

    def _run_alternatives():
        nonlocal alternatives_result
        alternatives_result = run_alternatives(product, emit=emit)

    alt_thread = threading.Thread(target=_run_alternatives, daemon=True)
    alt_thread.start()

    # Main sequential pipeline: each agent builds on the previous
    advocate_result  = run_advocate(product, owns=owns, emit=emit)
    skeptic_result   = run_skeptic(product, owns=owns, context={
        "advocate": advocate_result["analysis"]
    }, emit=emit)
    economist_result = run_economist(product, owns=owns, context={
        "advocate": advocate_result["analysis"],
        "skeptic":  skeptic_result["analysis"]
    }, emit=emit)

    # Orchestrator synthesizes all three — no searching, one structured call
    verdict = run_orchestrator(product, owns=owns, context={
        "advocate":  advocate_result["analysis"],
        "skeptic":   skeptic_result["analysis"],
        "economist": economist_result["analysis"]
    })

    # Wait for alternatives to finish before returning
    alt_thread.join()

    if emit:
        emit({"type": "verdict", "data": verdict})
        emit({"type": "done"})

    return {
        "advocate":     advocate_result,
        "skeptic":      skeptic_result,
        "economist":    economist_result,
        "alternatives": alternatives_result,
        "verdict":      verdict,
    }


if __name__ == "__main__":
    product = "Sony WH-1000XM5 Headphones"
    result = run_pipeline(product)

    print("\n=== ADVOCATE ===")
    print(result["advocate"]["analysis"])

    print("\n=== SKEPTIC ===")
    print(result["skeptic"]["analysis"])

    print("\n=== ECONOMIST ===")
    print(result["economist"]["analysis"])

    print("\n=== ALTERNATIVES ===")
    for alt in result["alternatives"].get("alternatives", []):
        print(f"  {alt['name']} · {alt['price']} — {alt['note']}")

    print("\n=== VERDICT ===")
    v = result["verdict"]
    print(f"  {v['decision']} ({v['confidence']}% confidence)")
    print(f"  {v['reasoning']}")
    if v.get("alternative"):
        print(f"  Consider: {v['alternative']}")
