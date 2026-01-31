package com.cinehub.backend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF (vì dùng Token)
            .authorizeHttpRequests(auth -> auth
                // 👇 DÒNG NÀY QUAN TRỌNG NHẤT: Cho phép truy cập tự do vào các API bắt đầu bằng /api/auth/
                .requestMatchers("/api/auth/**").permitAll() 
                .requestMatchers("/api/chat/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/payment/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/payment/**").permitAll()
                .requestMatchers("/api/booking/**").permitAll()
                .requestMatchers("/**").permitAll()
                // Các API khác bắt buộc phải đăng nhập mới được vào
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Không lưu session (dùng Token)
            )
            // .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}