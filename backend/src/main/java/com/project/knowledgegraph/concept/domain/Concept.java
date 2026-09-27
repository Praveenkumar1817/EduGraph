package com.project.knowledgegraph.concept.domain;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Node
public class Concept {
    @Id
    private String id;
    private String name;
    private String description;
    private String domain;
    private String difficulty;
    private List<String> tags;

    @Relationship(type = "PREREQUISITE_OF", direction = Relationship.Direction.OUTGOING)
    private Set<Concept> prerequisites = new HashSet<>();

    @Relationship(type = "RELATED_TO", direction = Relationship.Direction.OUTGOING)
    private Set<Concept> relatedConcepts = new HashSet<>();

    @Relationship(type = "PART_OF", direction = Relationship.Direction.OUTGOING)
    private Set<Concept> partOf = new HashSet<>();

    @Relationship(type = "SIMILAR_TO", direction = Relationship.Direction.OUTGOING)
    private Set<Concept> similarTo = new HashSet<>();

    public Concept() {}

    public Concept(String id, String name, String description, String domain, String difficulty, List<String> tags) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.domain = domain;
        this.difficulty = difficulty;
        this.tags = tags;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public Set<Concept> getPrerequisites() { return prerequisites; }
    public void setPrerequisites(Set<Concept> prerequisites) { this.prerequisites = prerequisites; }
    public Set<Concept> getRelatedConcepts() { return relatedConcepts; }
    public void setRelatedConcepts(Set<Concept> relatedConcepts) { this.relatedConcepts = relatedConcepts; }
    public Set<Concept> getPartOf() { return partOf; }
    public void setPartOf(Set<Concept> partOf) { this.partOf = partOf; }
    public Set<Concept> getSimilarTo() { return similarTo; }
    public void setSimilarTo(Set<Concept> similarTo) { this.similarTo = similarTo; }
}
