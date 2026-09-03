from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.analyzer import SourceAnalyzer
import os

app = FastAPI(title="Source Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    path: str

@app.post("/api/analyze")
async def analyze_source(request: AnalyzeRequest):
    analyzer = SourceAnalyzer()
    result = analyzer.analyze_directory(request.path)
    return result

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "Source Analyzer Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002)
