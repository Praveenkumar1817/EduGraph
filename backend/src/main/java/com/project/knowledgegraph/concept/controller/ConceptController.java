package com.project.knowledgegraph.concept.controller;

import com.project.knowledgegraph.concept.domain.Concept;
import com.project.knowledgegraph.concept.service.ConceptService;
import com.project.knowledgegraph.resource.domain.Resource;
import com.project.knowledgegraph.resource.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/concepts")
public class ConceptController {
    private final ConceptService conceptService;
    private final ResourceService resourceService;

    public ConceptController(ConceptService conceptService, ResourceService resourceService) {
        this.conceptService = conceptService;
        this.resourceService = resourceService;
    }

    @GetMapping
    public List<Concept> getAllConcepts() {
        return conceptService.getAllConcepts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Concept> getConceptById(@PathVariable String id) {
        return conceptService.getConceptById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/graph")
    public ResponseEntity<Map<String, Object>> getConceptGraph(@PathVariable String id) {
        Optional<Concept> conceptOpt = conceptService.getConceptById(id);
        if (conceptOpt.isEmpty()) return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        response.put("concept", conceptOpt.get());
        response.put("prerequisites", conceptService.getPrerequisites(id));
        response.put("related", conceptService.getRelated(id));
        response.put("resources", resourceService.findByConceptId(id));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/prerequisites")
    public List<Concept> getPrerequisites(@PathVariable String id) {
        return conceptService.getPrerequisites(id);
    }

    @GetMapping("/{id}/related")
    public List<Concept> getRelatedConcepts(@PathVariable String id) {
        return conceptService.getRelated(id);
    }

    @GetMapping("/{id}/resources")
    public List<Resource> getResources(@PathVariable String id) {
        return resourceService.findByConceptId(id);
    }
}
