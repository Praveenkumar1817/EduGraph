package com.project.knowledgegraph.resource.controller;

import com.project.knowledgegraph.resource.domain.Resource;
import com.project.knowledgegraph.resource.service.ResourceService;
import com.project.knowledgegraph.resource.service.PdfProcessingService;
import com.project.knowledgegraph.section.domain.Section;
import com.project.knowledgegraph.section.service.SectionService;
import com.project.knowledgegraph.chunk.domain.Chunk;
import com.project.knowledgegraph.chunk.service.ChunkService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {
    private final ResourceService service;
    private final SectionService sectionService;
    private final ChunkService chunkService;
    private final PdfProcessingService pdfProcessingService;
    
    public ResourceController(ResourceService service, SectionService sectionService, ChunkService chunkService, PdfProcessingService pdfProcessingService) { 
        this.service = service; 
        this.sectionService = sectionService;
        this.chunkService = chunkService;
        this.pdfProcessingService = pdfProcessingService;
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
    
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "difficulty", required = false) String difficulty) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }
        
        if (!file.getContentType().equals(MediaType.APPLICATION_PDF_VALUE) && !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body("Only PDF files are supported currently.");
        }
        
        try {
            Resource resource = pdfProcessingService.processPdf(file, title, description, difficulty);
            return ResponseEntity.ok(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to process PDF: " + e.getMessage());
        }
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
