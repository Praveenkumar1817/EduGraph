package com.project.knowledgegraph.section.repository;
import com.project.knowledgegraph.section.domain.Section;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SectionRepository extends Neo4jRepository<Section, String> {
    List<Section> findByResourceId(String resourceId);
}
