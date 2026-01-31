package com.cinehub.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenAiService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getReply(String userMessage) {
        String apiUrl = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + System.getenv("OPENAI_API_KEY")); // 👈 lấy từ biến môi trường
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = """
        {
          "model": "gpt-4o",
          "messages": [
            { "role": "user", "content": "%s" }
          ]
        }
        """.formatted(userMessage);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            System.out.println("✅ OpenAI raw response: " + response.getBody()); // 👈 log JSON gốc
            if (response.getStatusCode() == HttpStatus.OK) {
                return extractReply(response.getBody());
            } else {
                return "OpenAI trả về lỗi: " + response.getStatusCode();
            }
        } catch (HttpClientErrorException e) {
            System.out.println("❌ OpenAI error: " + e.getResponseBodyAsString());
            return "Xin lỗi, tôi chưa thể trả lời ngay lúc này.";
        } catch (Exception e) {
            System.out.println("❌ Lỗi không xác định: " + e.getMessage());
            return "Đã xảy ra lỗi khi gọi AI.";
        }
    }

    private String extractReply(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                JsonNode choice = choices.get(0);

                // Trường hợp chuẩn
                JsonNode messageNode = choice.path("message").path("content");
                if (!messageNode.isMissingNode() && !messageNode.asText().isEmpty()) {
                    return messageNode.asText();
                }

                // Trường hợp streaming/delta
                JsonNode deltaNode = choice.path("delta").path("content");
                if (!deltaNode.isMissingNode() && !deltaNode.asText().isEmpty()) {
                    return deltaNode.asText();
                }
            }
            return "Không tìm thấy phản hồi từ AI.";
        } catch (Exception e) {
            return "Lỗi khi phân tích phản hồi từ AI.";
        }
    }
}
