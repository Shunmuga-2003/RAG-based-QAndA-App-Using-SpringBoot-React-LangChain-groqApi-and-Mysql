package com.AiProject.RAG.controller;

import com.AiProject.RAG.model.Document;
import com.AiProject.RAG.model.User;
import com.AiProject.RAG.service.DocumentService;
import com.AiProject.RAG.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (!file.getOriginalFilename().endsWith(".pdf")) {
            return ResponseEntity.badRequest()
                    .body("Only PDF files allowed!");
        }

        if (file.getSize() > 50 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body("File must be less than 50MB!");
        }

        try {
            User user = userService
                    .findByEmail(userDetails.getUsername());
            Document doc = documentService.ingestPDF(file, user);
            return ResponseEntity.ok(doc);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to process PDF: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Document>> getDocuments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService
                .findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(
                documentService.getUserDocuments(user.getId())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService
                .findByEmail(userDetails.getUsername());
        documentService.deleteDocument(id, user.getId());
        return ResponseEntity.ok("Deleted successfully!");
    }
}