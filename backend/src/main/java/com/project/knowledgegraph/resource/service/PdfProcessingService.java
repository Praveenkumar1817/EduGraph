package com.project.knowledgegraph.resource.service;

import com.project.knowledgegraph.resource.domain.Resource;
import com.project.knowledgegraph.resource.domain.ResourceType;
import com.project.knowledgegraph.resource.repository.ResourceRepository;
import com.project.knowledgegraph.section.domain.Section;
import com.project.knowledgegraph.section.repository.SectionRepository;
import com.project.knowledgegraph.chunk.domain.Chunk;
import com.project.knowledgegraph.chunk.repository.ChunkRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class PdfProcessingService {

    @Autowired private ResourceRepository resourceRepository;
    @Autowired private SectionRepository sectionRepository;
    @Autowired private ChunkRepository chunkRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public Resource processPdf(MultipartFile file, String title, String description, String difficulty) throws IOException {
        // Ensure upload directory exists
        Path uploadPath = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR).toAbsolutePath();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file locally
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        file.transferTo(filePath.toFile());

        // Create Resource
        Resource resource = new Resource();
        resource.setId("res-" + UUID.randomUUID().toString().substring(0, 8));
        resource.setTitle(title != null && !title.isEmpty() ? title : file.getOriginalFilename());
        resource.setDescription(description);
        resource.setResourceType(ResourceType.PDF);
        resource.setUrl(filePath.toString());
        resource.setSource("User Upload");
        resource.setDifficulty(difficulty != null ? difficulty : "Intermediate");
        resource.setPublicationDate(LocalDate.now().toString());
        
        resource = resourceRepository.save(resource);

        // Process PDF
        try (PDDocument document = PDDocument.load(filePath.toFile())) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            int totalPages = document.getNumberOfPages();

            // For Phase 3, we create one default section for the whole document to hold chunks
            Section section = new Section();
            section.setId("sec-" + UUID.randomUUID().toString().substring(0, 8));
            section.setResourceId(resource.getId());
            section.setTitle("Document Body");
            section.setSectionNumber(1);
            section.setPageStart(1);
            section.setPageEnd(totalPages);
            section = sectionRepository.save(section);

            int chunkGlobalIndex = 1;

            // Extract text page by page to maintain page numbers
            for (int page = 1; page <= totalPages; page++) {
                pdfStripper.setStartPage(page);
                pdfStripper.setEndPage(page);
                String pageText = pdfStripper.getText(document);

                if (pageText == null || pageText.trim().isEmpty()) {
                    continue;
                }

                // Chunk the text (e.g. split by paragraphs or word counts)
                // Simple implementation: Split by ~500 words
                String[] words = pageText.split("\\s+");
                StringBuilder chunkContent = new StringBuilder();
                int wordCount = 0;

                for (int i = 0; i < words.length; i++) {
                    chunkContent.append(words[i]).append(" ");
                    wordCount++;

                    if (wordCount >= 300 || i == words.length - 1) { // 300 words per chunk roughly
                        String content = chunkContent.toString().trim();
                        if (!content.isEmpty()) {
                            Chunk chunk = new Chunk();
                            chunk.setId("chk-" + UUID.randomUUID().toString().substring(0, 8));
                            chunk.setSectionId(section.getId());
                            chunk.setResourceId(resource.getId());
                            chunk.setContent(content);
                            chunk.setPageNumber(page);
                            chunk.setChunkIndex(chunkGlobalIndex++);
                            chunkRepository.save(chunk);
                        }
                        
                        // Overlap of 50 words
                        chunkContent = new StringBuilder();
                        wordCount = 0;
                        if (i != words.length - 1) {
                            int backtrack = Math.min(50, i);
                            for (int j = i - backtrack + 1; j <= i; j++) {
                                chunkContent.append(words[j]).append(" ");
                                wordCount++;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Failed to process PDF: " + e.getMessage());
        }

        return resource;
    }
}

