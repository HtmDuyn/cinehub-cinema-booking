package com.cinehub.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    // 1. Tạo Token
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // 2. Tạo Token nâng cao
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 giờ
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 3. Lấy Username
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 4. Trích xuất thông tin
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // --- PHẦN BỔ SUNG QUAN TRỌNG ---

    // 5. Kiểm tra Token có hợp lệ không (User đúng & Chưa hết hạn)
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // 6. Kiểm tra hết hạn
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // 7. Lấy ngày hết hạn
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // --- HẾT PHẦN BỔ SUNG ---

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}