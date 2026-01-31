package com.cinehub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinehub.backend.model.entity.ChatMessage;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
        Long senderId, Long receiverId, Long receiverId2, Long senderId2
    );
}
