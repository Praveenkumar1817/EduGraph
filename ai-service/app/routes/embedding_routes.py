import logging
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import EMBEDDING_DIMENSION, EMBEDDING_MODEL
from app.services.embedding_service import embedding_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/embeddings",
    tags=["Embeddings"]
)


class EmbeddingRequest(BaseModel):
    text: str = Field(..., min_length=1)


class BatchEmbeddingRequest(BaseModel):
    texts: List[str] = Field(..., min_length=1)


class EmbeddingResponse(BaseModel):
    embedding: List[float]
    dimension: int
    model: str


class BatchEmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    dimension: int
    model: str


@router.post(
    "/generate",
    response_model=EmbeddingResponse
)
def generate_embedding(request: EmbeddingRequest):

    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text must not be empty"
        )

    try:
        embedding = embedding_service.generate_embedding(
            request.text
        )

        return EmbeddingResponse(
            embedding=embedding,
            dimension=EMBEDDING_DIMENSION,
            model=EMBEDDING_MODEL
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except RuntimeError as exc:
        logger.error("Embedding generation failed: %s", exc)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate embedding"
        )


@router.post(
    "/generate-batch",
    response_model=BatchEmbeddingResponse
)
def generate_batch_embeddings(
    request: BatchEmbeddingRequest
):

    if not request.texts:
        raise HTTPException(
            status_code=400,
            detail="Texts list must not be empty"
        )

    for index, text in enumerate(request.texts):
        if not text or not text.strip():
            raise HTTPException(
                status_code=400,
                detail=f"Text at index {index} must not be empty"
            )

    try:
        embeddings = embedding_service.generate_embeddings(
            request.texts
        )

        return BatchEmbeddingResponse(
            embeddings=embeddings,
            dimension=EMBEDDING_DIMENSION,
            model=EMBEDDING_MODEL
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except RuntimeError as exc:
        logger.error(
            "Batch embedding generation failed: %s",
            exc
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate batch embeddings"
        )