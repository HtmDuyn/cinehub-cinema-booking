package com.cinehub.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // 👈 thêm import này
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Lấy email gửi từ application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail); // dùng email từ cấu hình
        message.setTo(toEmail);
        message.setSubject("Mã xác thực tài khoản CineHub");
        message.setText("Xin chào,\n\nMã xác thực của bạn là: " + code + "\n\nMã này sẽ hết hạn sau 10 phút.");

        mailSender.send(message);
        System.out.println("Mail sent successfully...");
    }

    public void sendPasswordResetEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail); // dùng email từ cấu hình
        message.setTo(toEmail);
        message.setSubject("Mã đặt lại mật khẩu CineHub");
        message.setText("Xin chào,\n\nMã đặt lại mật khẩu của bạn là: " + code + "\n\nMã này sẽ hết hạn sau 10 phút.");

        mailSender.send(message);
        System.out.println("Mail sent successfully...");
    }

}
