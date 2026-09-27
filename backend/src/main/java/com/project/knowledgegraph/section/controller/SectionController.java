package com.project.knowledgegraph.section.controller;
import com.project.knowledgegraph.section.domain.Section;
import com.project.knowledgegraph.section.service.SectionService;
import com.project.knowledgegraph.resource.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class SectionController {
    private final SectionService service;
    private final ResourceService resourceService;
    public SectionController(SectionService service, ResourceService resourceService) { 
        this.service = service; 
        this.resourceService = resourceService;
    }
    
    @GetMapping("/resources/{resourceId}/sections")
    public ResponseEntity<List<Section>> getByResource(@PathVariable String resourceId) {
        if (!resourceService.findById(resourceId).isPresent()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.findByResourceId(resourceId));
    }
    
    @GetMapping("/sections/{id}")
    public ResponseEntity<Section> getById(@PathVariable String id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/resources/{resourceId}/sections")
    public ResponseEntity<Section> create(@PathVariable String resourceId, @RequestBody Section section) {
        if (!resourceService.findById(resourceId).isPresent()) return ResponseEntity.notFound().build();
        if (section.getId() == null || section.getId().isEmpty()) {
            section.setId(UUID.randomUUID().toString());
        }
        section.setResourceId(resourceId);
        return ResponseEntity.ok(service.save(section));
    }
    
    @PutMapping("/sections/{id}")
    public ResponseEntity<Section> update(@PathVariable String id, @RequestBody Section section) {
        if (!service.findById(id).isPresent()) return ResponseEntity.notFound().build();
        section.setId(id);
        return ResponseEntity.ok(service.save(section));
    }
    
    @DeleteMapping("/sections/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!service.findById(id).isPresent()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
