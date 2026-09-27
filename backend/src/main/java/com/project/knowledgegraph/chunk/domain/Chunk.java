package com.project.knowledgegraph.chunk.domain;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import java.util.HashSet;
import java.util.Set;
import com.project.knowledgegraph.concept.domain.Concept;

@Node
public class Chunk {
    @Id private String id;
    private String resourceId;
    private String sectionId;
    private String content;
    private Integer chunkIndex;
    private Integer pageNumber;
    private Integer tokenCount;
    private String createdAt;

    @Relationship(type = "MENTIONS", direction = Relationship.Direction.OUTGOING)
    private Set<Concept> concepts = new HashSet<>();

    public Chunk() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getSectionId() { return sectionId; }
    public void setSectionId(String sectionId) { this.sectionId = sectionId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getChunkIndex() { return chunkIndex; }
    public void setChunkIndex(Integer chunkIndex) { this.chunkIndex = chunkIndex; }
    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }
    public Integer getTokenCount() { return tokenCount; }
    public void setTokenCount(Integer tokenCount) { this.tokenCount = tokenCount; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public Set<Concept> getConcepts() { return concepts; }
    public void setConcepts(Set<Concept> concepts) { this.concepts = concepts; }
}
