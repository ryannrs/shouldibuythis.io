import string
from dotenv import load_dotenv
import os
from tavily import TavilyClient

load_dotenv()  # Load environment variables from .env file

def search(query: str) -> str:
    """LLM search function that allows agents to search for information."""
    # To install: pip install tavily-python
    
    client = TavilyClient(os.getenv("TAVILY_API_KEY"))
    response = client.search(
        query=query,
        search_depth="advanced"
    )
    output = []
    for result in response["results"]:
        output.append(f"Title: {result['title']}")
        output.append(f"URL: {result['url']}")
        output.append(f"Snippet: {result['content'][:500]}")
        output.append("-" * 80)
    return "\n".join(output)  # Print the first 500 characters of the snippet
        

if __name__ == "__main__":
    search("What is the best laptop for programming in 2024?")