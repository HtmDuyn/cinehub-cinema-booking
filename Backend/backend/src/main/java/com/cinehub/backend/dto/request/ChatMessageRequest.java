package com.cinehub.backend.dto.request;

public class ChatMessageRequest {
    private Long senderId;
    private Long receiverId;
    private String message;

    // Getters & Setters
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
