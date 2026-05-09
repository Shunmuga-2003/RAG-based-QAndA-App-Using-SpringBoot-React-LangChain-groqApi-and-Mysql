package com.AiProject.RAG.controller;

import com.AiProject.RAG.dto.ChatRequest;
import com.AiProject.RAG.dto.ChatResponse;
import com.AiProject.RAG.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request
    ) {
        if (request.getQuestion() == null ||
                request.getQuestion().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String answer = chatService.chat(request.getQuestion());
        return ResponseEntity.ok(
                new ChatResponse(request.getQuestion(), answer)
        );
    }
}