# Knowledge Graph Data Model

This document outlines the nodes and relationships in our Neo4j Concept-Resource Knowledge Graph.

## Nodes

1. **Concept**: Represents a technical concept (e.g., "Deadlock", "Semaphore").
   - Properties: `id`, `name`, `domain`, `description`, `difficulty`, `tags`
2. **Resource**: Represents learning material (e.g., PDF, Video).
   - Properties: `id`, `title`, `description`, `resourceType`, `url`, `source`, `author`, `difficulty`, `publicationDate`
3. **Section**: A division within a Resource (e.g., Chapter, Video Segment).
   - Properties: `id`, `resourceId`, `title`, `sectionNumber`, `pageStart`, `pageEnd`
4. **Chunk**: A granular piece of text/content within a Section (ready for embeddings).
   - Properties: `id`, `sectionId`, `resourceId`, `content`, `chunkIndex`, `pageNumber`

## Relationships

### Concept-Concept
- `(:Concept)-[:PREREQUISITE_OF]->(:Concept)`: Represents a learning dependency.
- `(:Concept)-[:RELATED_TO]->(:Concept)`: Represents sibling or associated concepts.
- `(:Concept)-[:SIMILAR_TO]->(:Concept)`: Concepts that share mechanisms.
- `(:Concept)-[:PART_OF]->(:Concept)`: Hierarchical aggregation (e.g., Process is PART_OF Operating System).

### Resource-Resource structure
- `(:Resource)-[:HAS_SECTION]->(:Section)`
- `(:Section)-[:HAS_CHUNK]->(:Chunk)`

### Resource-Concept coverage
- `(:Resource)-[:COVERS]->(:Concept)`: This resource teaches the concept.
- `(:Section)-[:COVERS]->(:Concept)`: This specific section teaches the concept.
- `(:Chunk)-[:MENTIONS]->(:Concept)`: This exact chunk refers to the concept.

## Example Queries

**Find all chunks for a resource that mention 'Semaphore':**
```cypher
MATCH (r:Resource {title: 'OS Synchronization Notes'})-[:HAS_SECTION]->(s:Section)-[:HAS_CHUNK]->(ch:Chunk)-[:MENTIONS]->(c:Concept {name: 'Semaphore'})
RETURN ch.content, ch.pageNumber
```

**Find prerequisite chain for Deadlock:**
```cypher
MATCH path = (p:Concept)-[:PREREQUISITE_OF*1..5]->(c:Concept {name: 'Deadlock'})
RETURN path
```
