package com.AiProject.RAG.service;


import com.AiProject.RAG.model.Document;
import com.AiProject.RAG.model.User;
import com.AiProject.RAG.repository.DocumentRepository;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final DocumentRepository documentRepository;

    public Document ingestPDF(MultipartFile file, User user)
            throws IOException {

        log.info("Starting PDF ingestion: {}", file.getOriginalFilename());

        // Step 1 - Extract text
        String text = extractTextFromPDF(file);
        log.info("Text extracted: {} chars", text.length());

        // Step 2 - Split into chunks
        List<TextSegment> segments = splitIntoChunks(text);
        log.info("Split into {} chunks", segments.size());

        // Step 3 - Generate embeddings
        List<Embedding> embeddings =
                embeddingModel.embedAll(segments).content();
        log.info("Embeddings generated: {}", embeddings.size());

        // Step 4 - Store in memory
        embeddingStore.addAll(embeddings, segments);
        log.info("Stored in InMemory store");

        // Step 5 - Save metadata to MySQL
        Document document = Document.builder()
                .filename(file.getOriginalFilename())
                .fileSize(file.getSize())
                .collectionName("documents")
                .chunkCount(segments.size())
                .user(user)
                .build();

        Document saved = documentRepository.save(document);
        log.info("Saved to MySQL id: {}", saved.getId());

        return saved;
    }

    private String extractTextFromPDF(MultipartFile file)
            throws IOException {
        try (PDDocument pdf = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(pdf);
            if (text == null || text.trim().isEmpty()) {
                throw new RuntimeException(
                        "Cannot extract text. PDF may be scanned."
                );
            }
            return text;
        }
    }

    private List<TextSegment> splitIntoChunks(String text) {
        dev.langchain4j.data.document.Document doc =
                dev.langchain4j.data.document.Document.from(text);
        DocumentSplitter splitter =
                DocumentSplitters.recursive(500, 50);
        return splitter.split(doc);
    }

    public List<Document> getUserDocuments(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    public void deleteDocument(Long id, Long userId) {
        documentRepository.deleteByIdAndUserId(id, userId);
    }
}