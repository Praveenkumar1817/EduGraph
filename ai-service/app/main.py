import logging

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from app.config import (
    EMBEDDING_MODEL,
    EMBEDDING_DIMENSION
)

from app.routes.embedding_routes import router
from app.services.embedding_service import embedding_service


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)

logger = logging.getLogger(__name__)


app = FastAPI(
    title="EduGraph AI Embedding Service",
    description=(
        "Local AI service for generating text embeddings "
        "using Sentence Transformers."
    ),
    version="1.0.0"
)


app.include_router(router)


@app.get("/health")
def health():

    if not embedding_service.is_loaded():
        return JSONResponse(
            status_code=503,
            content={
                "status": "DOWN",
                "model": EMBEDDING_MODEL,
                "dimension": EMBEDDING_DIMENSION
            }
        )

    return {
        "status": "UP",
        "model": EMBEDDING_MODEL,
        "dimension": EMBEDDING_DIMENSION
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):

    logger.exception(
        "Unexpected server error: %s",
        exc
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error"
        }
    )