package com.project.knowledgegraph.chunk.repository;
import com.project.knowledgegraph.chunk.domain.Chunk;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChunkRepository extends Neo4jRepository<Chunk, String> {
    List<Chunk> findBySectionId(String sectionId);
}
