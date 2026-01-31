package com.cinehub.backend.service;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.cinehub.backend.model.entity.PaymentStatus;
import com.cinehub.backend.util.MomoUtils;
@Service
public class MomoService implements  PaymentGateway {
    @Autowired 
    private PaymentService paymentService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String partnerCode = "MOMO";
    private final String accessKey = "F8BBA842ECF85";
    private final String secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    @Override
public String createPayment(String orderId, Double amount) {

    String requestId = UUID.randomUUID().toString();
    String amountStr = String.valueOf(amount.longValue());
    String extraData = "";

    Map<String, Object> body = new HashMap<>();
    body.put("partnerCode", partnerCode);
    body.put("accessKey", accessKey);
    body.put("requestId", requestId);
    body.put("amount", amountStr);
    body.put("orderId", orderId);
    body.put("orderInfo", "Thanh toán vé xem phim");
    body.put("redirectUrl", "http://localhost:8080/payment/success");
    body.put("ipnUrl", "http://localhost:8080/payment/notify");
    body.put("requestType", "captureWallet");
    body.put("extraData", extraData);

    // 🔐 rawData CHUẨN THỨ TỰ MO MO
    String rawData =
            "accessKey=" + accessKey +
            "&amount=" + amountStr +
            "&extraData=" + extraData +
            "&ipnUrl=http://localhost:8080/payment/notify" +
            "&orderId=" + orderId +
            "&orderInfo=Thanh toán vé xem phim" +
            "&partnerCode=" + partnerCode +
            "&redirectUrl=http://localhost:8080/payment/success" +
            "&requestId=" + requestId +
            "&requestType=captureWallet";

    String signature = MomoUtils.signSHA256(rawData, secretKey);
    body.put("signature", signature);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
ResponseEntity<Map> response = restTemplate.postForEntity(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        entity,
        Map.class
);

Map<String, Object> res = response.getBody();

// 🔴 CHECK LỖI MOMO
if (res == null || !"0".equals(String.valueOf(res.get("resultCode")))) {
    throw new RuntimeException(
        "MoMo error: " + (res != null ? res.get("message") : "No response body")
    );
}

// ✅ OK → trả link QR / redirect
return (String) res.get("payUrl");

}
    @Override
    public void handleCallback(Long paymentId, String resultCode, String transactionRef) {
        // TODO Auto-generated method stub
       if ("0".equals(resultCode)) { // Thanh toán thành công 
            paymentService.updatePaymentStatus(paymentId, PaymentStatus.SUCCESS, transactionRef); } 
        else { // Thanh toán thất bại 
            paymentService.updatePaymentStatus(paymentId, PaymentStatus.FAILED, transactionRef); }
    }

}
    