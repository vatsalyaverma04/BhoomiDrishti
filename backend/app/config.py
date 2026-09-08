import os
import re
import tempfile
from pathlib import Path

# Base Directories
BASE_DIR = Path(__file__).resolve().parent.parent

# Detect serverless environment (Vercel / AWS Lambda) where root filesystem is read-only
IS_SERVERLESS = bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))

if IS_SERVERLESS:
    TMP_ROOT = Path(tempfile.gettempdir())
    UPLOAD_DIR = TMP_ROOT / "bhoomi_uploads"
    PROCESSED_DIR = TMP_ROOT / "bhoomi_processed"
    DATA_DIR = TMP_ROOT / "bhoomi_data"
else:
    UPLOAD_DIR = BASE_DIR / "uploads"
    PROCESSED_DIR = BASE_DIR / "processed"
    DATA_DIR = BASE_DIR / "data"

for directory in [UPLOAD_DIR, PROCESSED_DIR, DATA_DIR]:
    try:
        directory.mkdir(exist_ok=True, parents=True)
    except OSError:
        pass

def load_env_file():
    """Load variables from .env or .env.example into os.environ if not already set."""
    candidates = [
        BASE_DIR / ".env",
        BASE_DIR / ".env.example",
        BASE_DIR.parent / ".env",
        BASE_DIR.parent / ".env.example"
    ]
    for env_path in candidates:
        if env_path.exists():
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            key, val = line.split("=", 1)
                            key = key.strip()
                            val = val.strip()
                            if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                                val = val[1:-1]
                            if key and key not in os.environ and val:
                                os.environ[key] = val
            except Exception as e:
                print(f"Notice: loading {env_path} skipped: {e}")

load_env_file()

# Google Gemini Vision Configuration (reads env var, falls back to active key)
GEMINI_API_KEY = (
    os.getenv("GEMINI_API_KEY", "")
    or os.getenv("VITE_GEMINI_API_KEY", "")
    or "AQ.Ab8RN6Lazswm7FGWjRwBB5Ngn0Q62TXW01csl5kcieotXDClCg"
)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# Supabase Cloud Database Configuration
SUPABASE_URL = (
    os.getenv("SUPABASE_URL", "")
    or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
    or os.getenv("VITE_SUPABASE_URL", "")
    or "https://vuaykfcqmqedotqoiqaq.supabase.co"
).rstrip("/")

SUPABASE_KEY = (
    os.getenv("SUPABASE_KEY", "")
    or os.getenv("SUPABASE_ANON_KEY", "")
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    or os.getenv("VITE_SUPABASE_KEY", "")
    or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1YXlrZmNxbXFlZG90cW9pcWFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODgwMDAxOCwiZXhwIjoyMTA0Mzc2MDE4fQ.ZRHdKf8BXUl5-95tKXrdk_k0ypHsHRANAC2ip9NpUX4"
)

# Server configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

# Supported Regional Languages
SUPPORTED_LANGUAGES = {
    "hi": "Hindi (हिंदी)",
    "mr": "Marathi (मराठी)",
    "te": "Telugu (తెలుగు)",
    "ta": "Tamil (தமிழ்)",
    "bn": "Bengali (বাংলা)",
    "gu": "Gujarati (ગુજરાતી)",
    "kn": "Kannada (ಕನ್ನಡ)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)",
    "en": "English"
}
