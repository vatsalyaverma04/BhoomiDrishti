import os
import sys
from pathlib import Path

# Add project root and backend to python path for Vercel Serverless runtime
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
BACKEND_DIR = PROJECT_ROOT / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Import the core FastAPI application
from app.main import app

# Vercel Serverless Function entrypoint
# The 'app' object is automatically discovered and handled by @vercel/python
