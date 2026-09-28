# EduGraph ??

EduGraph is an AI-powered Knowledge Graph application that maps computer science concepts (like OS, DBMS, Networks, OOP, and DSA) to learning resources (PDFs, Videos, and Books). 

It features an interactive React Flow visualization dashboard, a modern glassmorphic UI, and an automated PDF chunking engine that parses uploaded documents and maps their contents directly into a Neo4j graph database.

---

## ??? Tech Stack
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, React Flow (XYFlow)
* **Backend:** Java 17, Spring Boot 3, Spring Data Neo4j, Apache PDFBox
* **Databases:** PostgreSQL (Relational Data), Neo4j (Graph Data)
* **Infrastructure:** Docker & Docker Compose

---

## ?? Getting Started for Collaborators

Follow these steps to get the project running seamlessly on your local machine.

### 1. Prerequisites
You must have the following installed on your system:
* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Must be running in the background)
* [Java 17](https://adoptium.net/temurin/releases/)
* [Maven](https://maven.apache.org/)
* [Node.js (v18+)](https://nodejs.org/)

### 2. Clone the Repository
```bash
git clone https://github.com/Praveenkumar1817/EduGraph.git
cd EduGraph
```

### 3. Start the Databases (Docker)
The project relies on Neo4j and PostgreSQL. We use Docker Compose to spin them up instantly.
```bash
# Run this from the root of the project
docker-compose up -d
```
*Wait about 15-20 seconds for Neo4j to become fully healthy before starting the backend.*

### 4. Start the Backend (Spring Boot)
The backend handles the REST APIs and PDF extraction.
```bash
cd backend
mvn spring-boot:run
```
*The backend runs on `http://localhost:8081`.*

### 5. Start the Frontend (Vite + React)
Open a **new terminal window** and run:
```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

---

## ?? Features
- **Knowledge Graph Visualization:** Explore prerequisite dependencies between core technical concepts.
- **Resource Management:** Upload PDFs and view learning resources mapped directly to the graph.
- **PDF Chunking Engine:** Uploaded PDFs are automatically parsed by Apache PDFBox, chunked into overlapping segments, and securely saved into the Neo4j graph structure (Resource -> Section -> Chunk).

## ?? Contribution Guidelines
1. Always create a new branch for your feature: `git checkout -b feature-name`
2. Test your code locally to ensure both backend and frontend servers compile without errors.
3. Push your branch and submit a **Pull Request (PR)** to the `main` branch for review. Do not commit directly to `main`.
