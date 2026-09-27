package com.project.knowledgegraph.concept.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.knowledgegraph.concept.domain.Concept;
import com.project.knowledgegraph.concept.repository.ConceptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
@Order(1)
public class ConceptSeedRunner implements CommandLineRunner {
    @Autowired
    private ConceptRepository conceptRepository;

    @Override
    public void run(String... args) throws Exception {
        if (conceptRepository.count() > 0) {
            System.out.println("Neo4j database already contains concepts. Skipping seed.");
            return;
        }

        System.out.println("Seeding Neo4j database with 50 concepts...");
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(new ClassPathResource("seed.json").getInputStream());

        Map<String, Concept> conceptMap = new HashMap<>();

        for (JsonNode node : root.get("concepts")) {
            List<String> tags = new ArrayList<>();
            for (JsonNode tagNode : node.get("tags")) {
                tags.add(tagNode.asText());
            }
            Concept concept = new Concept(
                node.get("id").asText(),
                node.get("name").asText(),
                node.get("description").asText(),
                node.get("domain").asText(),
                node.get("difficulty").asText(),
                tags
            );
            conceptMap.put(concept.getId(), concept);
        }

        for (JsonNode relNode : root.get("relationships")) {
            String sourceId = relNode.get("source").asText();
            String targetId = relNode.get("target").asText();
            String type = relNode.get("type").asText();

            Concept source = conceptMap.get(sourceId);
            Concept target = conceptMap.get(targetId);

            if (source != null && target != null) {
                if ("PREREQUISITE_OF".equals(type)) {
                    source.getPrerequisites().add(target);
                } else if ("RELATED_TO".equals(type)) {
                    source.getRelatedConcepts().add(target);
                } else if ("PART_OF".equals(type)) {
                    source.getPartOf().add(target);
                } else if ("SIMILAR_TO".equals(type)) {
                    source.getSimilarTo().add(target);
                }
            }
        }

        conceptRepository.saveAll(conceptMap.values());
        System.out.println("Concept Seed completed.");
    }
}
