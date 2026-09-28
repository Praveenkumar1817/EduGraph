import os
from dotenv import load_dotenv

load_dotenv()

EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2"
)

EMBEDDING_DIMENSION = int(
    os.getenv("EMBEDDING_DIMENSION", "384")
)

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))