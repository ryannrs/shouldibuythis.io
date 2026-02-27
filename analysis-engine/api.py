from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio, json, threading
from uuid import uuid4
from pydantic import BaseModel
from pipeline import run_pipeline

app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://shouldibuythis.io"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
jobs: dict[str, asyncio.Queue] = {}

class AnalyzeRequest(BaseModel):
    product: str
    owns: str | None = None

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    job_id = str(uuid4())
    loop = asyncio.get_running_loop()
    q: asyncio.Queue = asyncio.Queue()
    jobs[job_id] = q

    def emit(event: dict):
        loop.call_soon_threadsafe(q.put_nowait, event)

    def run():
        try:
            run_pipeline(req.product, req.owns, emit=emit)
        except Exception as e:
            loop.call_soon_threadsafe(q.put_nowait, {"type": "error", "message": str(e)})
        finally:
            loop.call_soon_threadsafe(q.put_nowait, None)

    threading.Thread(target=run, daemon=True).start()
    return {"job_id": job_id}

@app.get("/stream/{job_id}")
async def stream(job_id: str):
    async def generator():
        q = jobs.get(job_id)
        if not q:
            yield f"data: {json.dumps({'type': 'error', 'message': 'job not found'})}\n\n"
            return
        while True:
            event = await q.get()
            if event is None:
                yield "data: [DONE]\n\n"
                jobs.pop(job_id, None)
                break
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(generator(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},)