package com.project.knowledgegraph.concept.service;

import com.project.knowledgegraph.concept.domain.Concept;
import com.project.knowledgegraph.concept.repository.ConceptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ConceptService {
    @Autowired
    private ConceptRepository repository;

    public List<Concept> getAllConcepts() {
        return repository.findAll();
    }

    public Optional<Concept> getConceptById(String id) {
        return repository.findById(id);
    }

    public List<Concept> getPrerequisites(String id) {
        return repository.findPrerequisites(id);
    }

    public List<Concept> getRelated(String id) {
        return repository.findRelatedConcepts(id);
    }
}
