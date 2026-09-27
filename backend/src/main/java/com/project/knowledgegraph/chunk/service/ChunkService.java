package com.project.knowledgegraph.chunk.service;
import com.project.knowledgegraph.chunk.domain.Chunk;
import com.project.knowledgegraph.chunk.repository.ChunkRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ChunkService {
    private final ChunkRepository repository;
    public ChunkService(ChunkRepository repository) { this.repository = repository; }
    public List<Chunk> findBySectionId(String sectionId) { return repository.findBySectionId(sectionId); }
    public Optional<Chunk> findById(String id) { return repository.findById(id); }
    public Chunk save(Chunk chunk) { return repository.save(chunk); }
    public void deleteById(String id) { repository.deleteById(id); }
}
