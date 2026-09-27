package com.project.knowledgegraph.section.domain;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import java.util.HashSet;
import java.util.Set;
import com.project.knowledgegraph.concept.domain.Concept;
import com.project.knowledgegraph.chunk.domain.Chunk;

@Node
public class Section {
    @Id private String id;
    private String resourceId;
    private String title;
    private Integer sectionNumber;
    private Integer pageStart;
    private Integer pageEnd;
    private String content;
    private String createdAt;

    @Relationship(type = "HAS_CHUNK", direction = Relationship.Direction.OUTGOING)
    private Set<Chunk> chunks = new HashSet<>();

    @Relationship(type = "COVERS", direction = Relationship.Direction.OUTGOING)
    private Set<Concept> concepts = new HashSet<>();

    public Section() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getSectionNumber() { return sectionNumber; }
    public void setSectionNumber(Integer sectionNumber) { this.sectionNumber = sectionNumber; }
    public Integer getPageStart() { return pageStart; }
    public void setPageStart(Integer pageStart) { this.pageStart = pageStart; }
    public Integer getPageEnd() { return pageEnd; }
    public void setPageEnd(Integer pageEnd) { this.pageEnd = pageEnd; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public Set<Chunk> getChunks() { return chunks; }
    public void setChunks(Set<Chunk> chunks) { this.chunks = chunks; }
    public Set<Concept> getConcepts() { return concepts; }
    public void setConcepts(Set<Concept> concepts) { this.concepts = concepts; }
}
