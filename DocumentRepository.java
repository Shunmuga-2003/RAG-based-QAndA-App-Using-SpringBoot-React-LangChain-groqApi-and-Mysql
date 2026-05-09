package com.AiProject.RAG.repository;


import com.AiProject.RAG.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface DocumentRepository
        extends JpaRepository<Document, Long> {

    List<Document> findByUserId(Long userId);

    // @Transactional needed for delete operations
    @Transactional
    void deleteByIdAndUserId(Long id, Long userId);
}