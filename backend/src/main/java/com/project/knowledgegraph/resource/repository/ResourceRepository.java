package com.project.knowledgegraph.resource.repository;
import com.project.knowledgegraph.resource.domain.Resource;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends Neo4jRepository<Resource, String> {
    @Query("MATCH (r:Resource)-[:COVERS]->(c:Concept) WHERE c.id = $id RETURN r")
    List<Resource> findByConceptId(String id);
}
