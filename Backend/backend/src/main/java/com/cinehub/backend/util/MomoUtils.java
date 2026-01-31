package com.cinehub.backend.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

// public class MomoUtils {
//     public static String signSHA256(String data, String secretKey) {
//         try {
//             Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
//             SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
//             hmacSHA256.init(secretKeySpec);
//             byte[] hash = hmacSHA256.doFinal(data.getBytes());
//             return Base64.getEncoder().encodeToString(hash);
//         } catch (IllegalStateException | InvalidKeyException | NoSuchAlgorithmException e) {
//             throw new RuntimeException("Error signing data", e);
//         }
//     }
// }
public class MomoUtils {
    public static String signSHA256(String data, String secretKey) {
        try {
            Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
            hmacSHA256.init(secretKeySpec);
            byte[] hash = hmacSHA256.doFinal(data.getBytes());

            // SAI: return Base64.getEncoder().encodeToString(hash);
            
            // ĐÚNG: Chuyển sang Hex
            StringBuilder result = new StringBuilder();
            for (byte b : hash) {
                result.append(String.format("%02x", b));
            }
            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error signing data", e);
        }
    }
}
