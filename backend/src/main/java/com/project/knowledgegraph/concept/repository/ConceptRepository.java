package com.project.knowledgegraph.concept.repository;

import com.project.knowledgegraph.concept.domain.Concept;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConceptRepository extends Neo4jRepository<Concept, String> {
    @Query("MATCH (p:Concept)-[:PREREQUISITE_OF]->(c:Concept) WHERE c.id = $id RETURN p")
    List<Concept> findPrerequisites(String id);

    @Query("MATCH (c:Concept)-[:RELATED_TO]-(r:Concept) WHERE c.id = $id RETURN r")
    List<Concept> findRelatedConcepts(String id);
}
