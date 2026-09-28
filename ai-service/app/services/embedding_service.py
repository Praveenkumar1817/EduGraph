import logging
from typing import List

from sentence_transformers import SentenceTransformer

from app.config import EMBEDDING_MODEL, EMBEDDING_DIMENSION

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Service responsible for loading the Sentence Transformer model
    once and generating embeddings.
    """

    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        """Load the embedding model once when the service starts."""
        try:
            logger.info("Loading embedding model: %s", EMBEDDING_MODEL)

            self.model = SentenceTransformer(EMBEDDING_MODEL)

            logger.info(
                "Embedding model loaded successfully. Dimension: %d",
                EMBEDDING_DIMENSION
            )

        except Exception as exc:
            logger.exception("Failed to load embedding model")
            raise RuntimeError(
                "Failed to load embedding model"
            ) from exc

    def is_loaded(self) -> bool:
        """Check whether the model is loaded."""
        return self.model is not None

    def generate_embedding(self, text: str) -> List[float]:
        """Generate an embedding for a single text."""

        if not text or not text.strip():
            raise ValueError("Text must not be empty")

        if not self.is_loaded():
            raise RuntimeError("Embedding model is not loaded")

        try:
            embedding = self.model.encode(
                text,
                convert_to_numpy=True,
                normalize_embeddings=False
            )

            embedding_list = embedding.tolist()

            if len(embedding_list) != EMBEDDING_DIMENSION:
                raise RuntimeError(
                    f"Unexpected embedding dimension: "
                    f"{len(embedding_list)}"
                )

            return embedding_list

        except ValueError:
            raise

        except Exception as exc:
            logger.exception("Error generating embedding")
            raise RuntimeError(
                "Failed to generate embedding"
            ) from exc

    def generate_embeddings(
        self,
        texts: List[str]
    ) -> List[List[float]]:
        """Generate embeddings for multiple texts using batch encoding."""

        if not texts:
            raise ValueError("Texts list must not be empty")

        for index, text in enumerate(texts):
            if not text or not text.strip():
                raise ValueError(
                    f"Text at index {index} must not be empty"
                )

        if not self.is_loaded():
            raise RuntimeError("Embedding model is not loaded")

        try:
            embeddings = self.model.encode(
                texts,
                convert_to_numpy=True,
                normalize_embeddings=False,
                batch_size=32
            )

            embedding_list = embeddings.tolist()

            if len(embedding_list) != len(texts):
                raise RuntimeError(
                    "Number of embeddings does not match "
                    "number of input texts"
                )

            for index, embedding in enumerate(embedding_list):
                if len(embedding) != EMBEDDING_DIMENSION:
                    raise RuntimeError(
                        f"Unexpected embedding dimension at index "
                        f"{index}: {len(embedding)}"
                    )

            return embedding_list

        except ValueError:
            raise

        except Exception as exc:
            logger.exception("Error generating batch embeddings")
            raise RuntimeError(
                "Failed to generate batch embeddings"
            ) from exc


embedding_service = EmbeddingService()