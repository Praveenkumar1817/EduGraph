package com.project.knowledgegraph.resource.service;
import com.project.knowledgegraph.resource.domain.Resource;
import com.project.knowledgegraph.resource.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {
    private final ResourceRepository repository;
    public ResourceService(ResourceRepository repository) { this.repository = repository; }
    public List<Resource> findAll() { return repository.findAll(); }
    public Optional<Resource> findById(String id) { return repository.findById(id); }
    public Resource save(Resource resource) { return repository.save(resource); }
    public void deleteById(String id) { repository.deleteById(id); }
    public List<Resource> findByConceptId(String conceptId) { return repository.findByConceptId(conceptId); }
}
