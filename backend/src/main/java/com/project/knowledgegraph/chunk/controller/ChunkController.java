package com.project.knowledgegraph.chunk.controller;
import com.project.knowledgegraph.chunk.domain.Chunk;
import com.project.knowledgegraph.chunk.service.ChunkService;
import com.project.knowledgegraph.section.service.SectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ChunkController {
    private final ChunkService service;
    private final SectionService sectionService;
    public ChunkController(ChunkService service, SectionService sectionService) { 
        this.service = service; 
        this.sectionService = sectionService;
    }
    
    @GetMapping("/sections/{sectionId}/chunks")
    public ResponseEntity<List<Chunk>> getBySection(@PathVariable String sectionId) {
        if (!sectionService.findById(sectionId).isPresent()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.findBySectionId(sectionId));
    }
    
    @GetMapping("/chunks/{id}")
    public ResponseEntity<Chunk> getById(@PathVariable String id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/sections/{sectionId}/chunks")
    public ResponseEntity<Chunk> create(@PathVariable String sectionId, @RequestBody Chunk chunk) {
        return sectionService.findById(sectionId).map(section -> {
            if (chunk.getId() == null || chunk.getId().isEmpty()) {
                chunk.setId(UUID.randomUUID().toString());
            }
            chunk.setSectionId(sectionId);
            chunk.setResourceId(section.getResourceId());
            return ResponseEntity.ok(service.save(chunk));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/chunks/{id}")
    public ResponseEntity<Chunk> update(@PathVariable String id, @RequestBody Chunk chunk) {
        if (!service.findById(id).isPresent()) return ResponseEntity.notFound().build();
        chunk.setId(id);
        return ResponseEntity.ok(service.save(chunk));
    }
    
    @DeleteMapping("/chunks/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!service.findById(id).isPresent()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
