package com.cinehub.backend.service;

public interface PaymentGateway {
     String createPayment(String orderId, Double amount); 
     void handleCallback(Long paymentId, String resultCode, String transactionRef); 
 }