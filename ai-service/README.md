# EduGraph AI Embedding Service

This service provides a local **FastAPI API** for converting text into numerical embeddings using:

`sentence-transformers/all-MiniLM-L6-v2`

The model produces a **384-dimensional embedding vector**.

This service is implemented as **Phase 4.1** of the EduGraph project.

---

## Features

* Local FastAPI-based embedding service
* Uses Sentence Transformers
* Uses `sentence-transformers/all-MiniLM-L6-v2`
* Produces 384-dimensional embeddings
* Single text embedding generation
* Batch embedding generation
* Batch processing using model batch encoding
* Model loaded once when the service starts
* Empty text validation
* Clean HTTP error responses
* Environment-based configuration
* Swagger API documentation

---

## Technology Stack

* Python 3.12
* FastAPI
* Uvicorn
* Sentence Transformers
* PyTorch
* Pydantic
* NumPy
* Python Dotenv

---

## Model

### Model Name

```text
sentence-transformers/all-MiniLM-L6-v2
```

### Embedding Dimension

```text
384
```

The same model is used for both single and batch embedding generation.

---

## Project Structure

```text
ai-service/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   │
│   ├── services/
│   │   └── embedding_service.py
│   │
│   └── routes/
│       └── embedding_routes.py
│
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## Requirements

* Python 3.12
* pip
* Internet connection for the first model download
* Sufficient disk space for Python packages and the model

Python 3.12 is recommended for this service.

Check the Python version:

```powershell
python --version
```

Expected:

```text
Python 3.12.x
```

---

## Setup

### 1. Navigate to the AI service

```powershell
cd "C:\Users\Pooraniradhakrishnan\OneDrive\Desktop\EduGraph\ai-service"
```

### 2. Create a virtual environment

```powershell
py -3.12 -m venv venv
```

### 3. Activate the virtual environment

Windows PowerShell:

```powershell
venv\Scripts\activate
```

After activation, the terminal should show:

```text
(venv)
```

### 4. Upgrade pip

```powershell
python -m pip install --upgrade pip
```

### 5. Install dependencies

```powershell
pip install -r requirements.txt
```

---

## Configuration

The service supports environment variables.

Create a `.env` file if custom configuration is required.

Example:

```env
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
EMBEDDING_DIMENSION=384
HOST=0.0.0.0
PORT=8000
```

A sample configuration is provided in:

```text
.env.example
```

Do not commit the `.env` file to Git.

---

## Start the Service

Run:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The service will be available at:

```text
http://localhost:8000
```

Expected startup message:

```text
Application startup complete.
Uvicorn running on http://0.0.0.0:8000
```

To stop the service:

```text
Ctrl + C
```

---

## Swagger API Documentation

FastAPI provides interactive API documentation.

Open:

```text
http://localhost:8000/docs
```

Available endpoints:

```text
GET  /health
POST /api/embeddings/generate
POST /api/embeddings/generate-batch
```

---

# API Endpoints

## 1. Health Check

### Endpoint

```http
GET /health
```

### Example

PowerShell:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

### Response

```json
{
  "status": "UP",
  "model": "sentence-transformers/all-MiniLM-L6-v2",
  "dimension": 384
}
```

The health endpoint confirms that:

* The service is running.
* The embedding model is loaded.
* The expected embedding dimension is configured.

---

# 2. Generate Single Embedding

### Endpoint

```http
POST /api/embeddings/generate
```

### Request

```json
{
  "text": "Computer science is the study of computation and information."
}
```

### PowerShell Example

```powershell
$body = @{
    text = "Computer science is the study of computation and information."
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri http://localhost:8000/api/embeddings/generate `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Response

```json
{
  "embedding": [
    -0.01912817358970642,
    0.0822891891002655,
    -0.08149070292711258
  ],
  "dimension": 384,
  "model": "sentence-transformers/all-MiniLM-L6-v2"
}
```

The actual `embedding` array contains **384 numerical values**.

---

# 3. Generate Batch Embeddings

### Endpoint

```http
POST /api/embeddings/generate-batch
```

### Request

```json
{
  "texts": [
    "Computer science is the study of computation.",
    "Machine learning is a branch of artificial intelligence.",
    "Databases store and organize information."
  ]
}
```

### PowerShell Example

```powershell
$body = @{
    texts = @(
        "Computer science is the study of computation.",
        "Machine learning is a branch of artificial intelligence.",
        "Databases store and organize information."
    )
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri http://localhost:8000/api/embeddings/generate-batch `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Response

```json
{
  "embeddings": [
    [384 numerical values],
    [384 numerical values],
    [384 numerical values]
  ],
  "dimension": 384,
  "model": "sentence-transformers/all-MiniLM-L6-v2"
}
```

For 3 input texts, the service returns 3 embedding vectors.

Each vector contains exactly **384 values**.

The batch endpoint uses batch encoding instead of processing each text individually.

---

# Input Validation

The service rejects empty text.

### Example

```json
{
  "text": "   "
}
```

Response:

```json
{
  "detail": "Text must not be empty"
}
```

The endpoint returns HTTP status:

```text
400 Bad Request
```

Batch requests also reject empty strings inside the input list.

---

# Model Loading

The Sentence Transformer model is loaded once when the FastAPI service starts.

The model is stored by the `EmbeddingService` and reused for subsequent requests.

This avoids loading the model separately for every API request.

---

# Error Handling

The service provides clean HTTP errors for invalid requests and internal processing failures.

Examples include:

```text
400 Bad Request
```

for invalid or empty input.

Unexpected server errors return a clean response instead of exposing internal stack traces to the API client.

Server-side errors are logged for debugging.

---

# Testing

The following tests were performed for Phase 4.1.

### Health Check

```text
GET /health
```

Result:

```text
Status: UP
Model: sentence-transformers/all-MiniLM-L6-v2
Dimension: 384
```

### Single Embedding

```text
POST /api/embeddings/generate
```

Result:

```text
Embedding generated successfully
Dimension: 384
```

### Batch Embedding

```text
POST /api/embeddings/generate-batch
```

Result:

```text
Multiple embeddings generated successfully
Each embedding dimension: 384
```

### Empty Text Validation

```text
POST /api/embeddings/generate
```

with empty text.

Result:

```text
400 Bad Request
Text must not be empty
```

---

# Phase 4.1 Scope

This service is limited to **embedding generation**.

### Included

* FastAPI service
* Sentence Transformer model
* Single embeddings
* Batch embeddings
* Input validation
* Health check
* Configuration
* API documentation

### Not Included

The following are outside the scope of Phase 4.1:

* PostgreSQL
* pgvector
* Neo4j integration
* Semantic search
* GraphRAG
* Gemini/OpenAI APIs
* LLM-based concept extraction
* Recommendations
* Learning paths

These features can be implemented in later phases.

---

# Running the Service

From the `ai-service` directory:

```powershell
venv\Scripts\activate
```

Then:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Check:

```text
http://localhost:8000/health
```

Open API documentation:

```text
http://localhost:8000/docs
```

---

# Phase 4.1 Completion

Phase 4.1 is complete when:

* [x] AI service starts successfully
* [x] Embedding model loads successfully
* [x] Health endpoint works
* [x] Single embedding endpoint works
* [x] Batch embedding endpoint works
* [x] Embedding dimension is 384
* [x] Empty text is rejected
* [x] Model is loaded once at startup
* [x] API documentation is available
* [x] Phase 1–3 functionality remains unaffected
