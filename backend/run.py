import os
import uvicorn
from app.config import HOST, PORT

if __name__ == "__main__":
    run_host = os.getenv("HOST", HOST)
    run_port = int(os.getenv("PORT", PORT))
    print(f"Starting BhoomiDrishti AI Backend Server on http://{run_host}:{run_port}")
    uvicorn.run("app.main:app", host=run_host, port=run_port, reload=False)
