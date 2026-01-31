package com.cinehub.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinehub.backend.dto.request.ChatMessageRequest;
import com.cinehub.backend.model.entity.ChatMessage;
import com.cinehub.backend.repository.ChatRepository;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private OpenAiService openAiService; // service gọi OpenAI 
    public List<ChatMessage> sendMessage(ChatMessageRequest request) {
        //1. Lưu tin nhắn người dùng
        
        ChatMessage msg = new ChatMessage();
        msg.setSenderId(request.getSenderId());
        msg.setReceiverId(request.getReceiverId());
        msg.setMessage(request.getMessage());
        msg.setTimestamp(LocalDateTime.now());
        chatRepository.save(msg);
        //2. Gọi OpenAI để lấy phản hồi
        String reply = openAiService.getReply(request.getMessage());
        //3. Lưu tin nhắn phản hồi từ OpenAI
        ChatMessage aiMsg = new ChatMessage(); 
        aiMsg.setSenderId(request.getReceiverId()); // AI là người trả lời 
        aiMsg.setReceiverId(request.getSenderId()); 
        aiMsg.setMessage(reply); aiMsg.setTimestamp(LocalDateTime.now()); 
        chatRepository.save(aiMsg);
        return List.of(msg, aiMsg);
    }

    public List<ChatMessage> getConversation(Long user1, Long user2) {
        return chatRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(user1, user2, user1, user2);
    }
}
