package com.project.knowledgegraph.resource.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.knowledgegraph.resource.domain.Resource;
import com.project.knowledgegraph.resource.domain.ResourceType;
import com.project.knowledgegraph.resource.repository.ResourceRepository;
import com.project.knowledgegraph.section.domain.Section;
import com.project.knowledgegraph.section.repository.SectionRepository;
import com.project.knowledgegraph.chunk.domain.Chunk;
import com.project.knowledgegraph.chunk.repository.ChunkRepository;
import com.project.knowledgegraph.concept.domain.Concept;
import com.project.knowledgegraph.concept.repository.ConceptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@Order(2)
public class ResourceSeedRunner implements CommandLineRunner {
    @Autowired private ResourceRepository resourceRepository;
    @Autowired private SectionRepository sectionRepository;
    @Autowired private ChunkRepository chunkRepository;
    @Autowired private ConceptRepository conceptRepository;

    @Override
    public void run(String... args) throws Exception {
        if (resourceRepository.count() > 0) {
            System.out.println("Neo4j database already contains resources. Skipping resource seed.");
            return;
        }

        System.out.println("Seeding Neo4j database with resources...");
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(new ClassPathResource("resource-seed.json").getInputStream());

        // Load all concepts into a map
        Map<String, Concept> conceptMap = new HashMap<>();
        conceptRepository.findAll().forEach(c -> conceptMap.put(c.getId(), c));

        Map<String, Resource> resourceMap = new HashMap<>();
        for (JsonNode node : root.get("resources")) {
            Resource r = new Resource();
            r.setId(node.get("id").asText());
            r.setTitle(node.get("title").asText());
            r.setDescription(node.get("description").asText());
            r.setResourceType(ResourceType.valueOf(node.get("resourceType").asText()));
            r.setUrl(node.get("url").asText());
            r.setSource(node.get("source").asText());
            r.setAuthor(node.get("author").asText());
            r.setDifficulty(node.get("difficulty").asText());
            r.setPublicationDate(node.get("publicationDate").asText());

            for (JsonNode coverNode : node.get("covers")) {
                Concept c = conceptMap.get(coverNode.asText());
                if (c != null) r.getConcepts().add(c);
            }
            resourceMap.put(r.getId(), r);
        }
        resourceRepository.saveAll(resourceMap.values());

        Map<String, Section> sectionMap = new HashMap<>();
        if (root.has("sections")) {
            for (JsonNode node : root.get("sections")) {
                Section s = new Section();
                s.setId(node.get("id").asText());
                s.setResourceId(node.get("resourceId").asText());
                s.setTitle(node.get("title").asText());
                s.setSectionNumber(node.get("sectionNumber").asInt());
                s.setPageStart(node.get("pageStart").asInt());
                s.setPageEnd(node.get("pageEnd").asInt());
                
                for (JsonNode coverNode : node.get("covers")) {
                    Concept c = conceptMap.get(coverNode.asText());
                    if (c != null) s.getConcepts().add(c);
                }

                Resource parent = resourceMap.get(s.getResourceId());
                if (parent != null) {
                    parent.getSections().add(s);
                    sectionMap.put(s.getId(), s);
                }
            }
            // Save sections directly
            sectionRepository.saveAll(sectionMap.values());
            // Update resources with the new relationships
            resourceRepository.saveAll(resourceMap.values());
        }

        Map<String, Chunk> chunkMap = new HashMap<>();
        if (root.has("chunks")) {
            for (JsonNode node : root.get("chunks")) {
                Chunk ch = new Chunk();
                ch.setId(node.get("id").asText());
                ch.setSectionId(node.get("sectionId").asText());
                ch.setResourceId(node.get("resourceId").asText());
                ch.setContent(node.get("content").asText());
                ch.setChunkIndex(node.get("chunkIndex").asInt());
                ch.setPageNumber(node.get("pageNumber").asInt());

                for (JsonNode mentionNode : node.get("mentions")) {
                    Concept c = conceptMap.get(mentionNode.asText());
                    if (c != null) ch.getConcepts().add(c);
                }

                Section parent = sectionMap.get(ch.getSectionId());
                if (parent != null) {
                    parent.getChunks().add(ch);
                    chunkMap.put(ch.getId(), ch);
                }
            }
            chunkRepository.saveAll(chunkMap.values());
            sectionRepository.saveAll(sectionMap.values());
        }

        System.out.println("Resource Seed completed.");
    }
}
