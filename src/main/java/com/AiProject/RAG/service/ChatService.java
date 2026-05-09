package com.AiProject.RAG.service;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatLanguageModel chatModel;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public String chat(String question) {

        log.info("Question: {}", question);

        // Step 1 - Embed question
        Embedding questionEmbedding =
                embeddingModel.embed(question).content();

        // Step 2 - Find top 5 similar chunks
        List<EmbeddingMatch<TextSegment>> matches =
                embeddingStore.findRelevant(questionEmbedding, 5);

        log.info("Found {} relevant chunks", matches.size());

        if (matches.isEmpty()) {
            return "No relevant information found. " +
                    "Please upload a PDF first.";
        }

        // Step 3 - Build context
        String context = matches.stream()
                .map(m -> m.embedded().text())
                .collect(Collectors.joining("\n\n"));

        // Step 4 - Build prompt
        String prompt = """
                You are a helpful document assistant.
                Answer the question based ONLY on the context below.
                If answer not found say:
                "I could not find the answer in the document."
                
                Context:
                %s
                
                Question: %s
                
                Answer:
                """.formatted(context, question);

        // Step 5 - Get answer from Groq
        String answer = chatModel.generate(prompt);
        log.info("Answer generated successfully");

        return answer;
    }
}