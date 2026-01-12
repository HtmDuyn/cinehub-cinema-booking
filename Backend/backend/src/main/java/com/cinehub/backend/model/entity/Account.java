package com.cinehub.backend.model.entity;

import com.cinehub.backend.model.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder // Dùng để tạo object nhanh: Account.builder().username("...").build()
@NoArgsConstructor // Bắt buộc cho JPA
@AllArgsConstructor
@Entity
@Table(name = "accounts") // Đổi thành số nhiều cho chuẩn
public class Account implements UserDetails { // Kế thừa UserDetails của Spring Security

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "phone_number", length = 15)
    private String phoneNumber; 
    
    @Column(name = "full_name")
    private String fullName;

    // --- THÊM MỚI CHO RẠP PHIM ---
    @Column(name = "membership_score")
    private Integer membershipScore = 0; // Điểm tích lũy (Mặc định là 0)

    @Column(name = "is_active")
    private boolean isActive = true; // Trạng thái (Mặc định là đang hoạt động)

    @Enumerated(EnumType.STRING)
    private Role role;

    // --- CẤU HÌNH SPRING SECURITY ---
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Chỉ cho Spring biết user này có quyền gì
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return username; // Spring dùng cái này để xác thực
    }

    @Override
    public String getPassword() {
        return password;
    }

    // Các hàm dưới đây để mặc định là true (Tài khoản không bao giờ hết hạn/bị khóa tự động)
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return isActive; } // Nếu isActive = false thì không đăng nhập được
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}