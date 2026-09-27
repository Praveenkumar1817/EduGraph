package com.project.knowledgegraph.section.service;
import com.project.knowledgegraph.section.domain.Section;
import com.project.knowledgegraph.section.repository.SectionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SectionService {
    private final SectionRepository repository;
    public SectionService(SectionRepository repository) { this.repository = repository; }
    public List<Section> findByResourceId(String resourceId) { return repository.findByResourceId(resourceId); }
    public Optional<Section> findById(String id) { return repository.findById(id); }
    public Section save(Section section) { return repository.save(section); }
    public void deleteById(String id) { repository.deleteById(id); }
}
