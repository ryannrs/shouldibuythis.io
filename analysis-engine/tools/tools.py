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