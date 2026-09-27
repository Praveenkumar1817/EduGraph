package com.project.knowledgegraph.resource.controller;

import com.project.knowledgegraph.resource.domain.Resource;
import com.project.knowledgegraph.resource.service.ResourceService;
import com.project.knowledgegraph.section.domain.Section;
import com.project.knowledgegraph.section.service.SectionService;
import com.project.knowledgegraph.chunk.domain.Chunk;
import com.project.knowledgegraph.chunk.service.ChunkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {
    private final ResourceService service;
    private final SectionService sectionService;
    private final ChunkService chunkService;
    
    public ResourceController(ResourceService service, SectionService sectionService, ChunkService chunkService) { 
        this.service = service; 
        this.sectionService = sectionService;
        this.chunkService = chunkService;
    }
    
    @GetMapping
    public List<Resource> getAll() { return service.findAll(); }
    
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getById(@PathVariable String id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/structure")
    public ResponseEntity<Map<String, Object>> getStructure(@PathVariable String id) {
        Optional<Resource> resOpt = service.findById(id);
        if (resOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Resource r = resOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("resource", r);
        
        List<Section> sections = sectionService.findByResourceId(id);
        List<Map<String, Object>> sectionData = new ArrayList<>();
        
        for (Section sec : sections) {
            Map<String, Object> secMap = new HashMap<>();
            secMap.put("section", sec);
            List<Chunk> chunks = chunkService.findBySectionId(sec.getId());
            secMap.put("chunks", chunks);
            sectionData.add(secMap);
        }
        
        response.put("sections", sectionData);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public Resource create(@RequestBody Resource resource) {
        if (resource.getId() == null || resource.getId().isEmpty()) {
            resource.setId(UUID.randomUUID().toString());
        }
        return service.save(resource);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Resource> update(@PathVariable String id, @RequestBody Resource resource) {
        if (!service.findById(id).isPresent()) return ResponseEntity.notFound().build();
        resource.setId(id);
        return ResponseEntity.ok(service.save(resource));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!service.findById(id).isPresent()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
