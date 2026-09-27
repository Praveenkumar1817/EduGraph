package com.project.knowledgegraph.resource.domain;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import java.util.HashSet;
import java.util.Set;
import com.project.knowledgegraph.concept.domain.Concept;
import com.project.knowledgegraph.section.domain.Section;

@Node
public class Resource {
    @Id private String id;
    private String title;
    private String description;
    private ResourceType resourceType;
    private String url;
    private String source;
    private String author;
    private String difficulty;
    private String publicationDate;
    private String createdAt;
    private String updatedAt;

    @Relationship(type = "COVERS", direction = Relationship.Direction.OUTGOING)
    private Set<Concept> concepts = new HashSet<>();

    @Relationship(type = "HAS_SECTION", direction = Relationship.Direction.OUTGOING)
    private Set<Section> sections = new HashSet<>();

    public Resource() {}
    public Resource(String id, String title, ResourceType resourceType) { this.id = id; this.title = title; this.resourceType = resourceType; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ResourceType getResourceType() { return resourceType; }
    public void setResourceType(ResourceType resourceType) { this.resourceType = resourceType; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getPublicationDate() { return publicationDate; }
    public void setPublicationDate(String publicationDate) { this.publicationDate = publicationDate; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    public Set<Concept> getConcepts() { return concepts; }
    public void setConcepts(Set<Concept> concepts) { this.concepts = concepts; }
    public Set<Section> getSections() { return sections; }
    public void setSections(Set<Section> sections) { this.sections = sections; }
}
