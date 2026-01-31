package com.cinehub.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinehub.backend.dto.request.ChatMessageRequest;
import com.cinehub.backend.model.entity.ChatMessage;
import com.cinehub.backend.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping("/send") 
    public ResponseEntity<List<ChatMessage>> sendMessage(@RequestBody ChatMessageRequest request) { 
        List<ChatMessage> messages = chatService.sendMessage(request); 
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/conversation/{user1}/{user2}")
    public ResponseEntity<List<ChatMessage>> getConversation(@PathVariable Long user1, @PathVariable Long user2) {
        return ResponseEntity.ok(chatService.getConversation(user1, user2));
    }
}
