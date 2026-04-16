"""
Predix Simple Backend - Minimal version for local development
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create app
app = FastAPI(
    title="Predix API",
    version="1.0.0",
    description="AI-powered viral prediction platform"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Predix API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "predix-backend"}

@app.get("/api/v1/health")
async def api_health():
    return {"status": "healthy", "api_version": "v1"}

@app.get("/api/v1/trends")
async def get_trends():
    # Mock data for testing
    return {
        "trends": [
            {
                "id": 1,
                "platform": "tiktok",
                "name": "#DanceChallenge2024",
                "viral_score": 85,
                "views": 5000000,
                "engagement_rate": 6.5
            },
            {
                "id": 2,
                "platform": "twitter",
                "name": "#TechNews",
                "viral_score": 72,
                "views": 2000000,
               "engagement_rate": 4.2
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
