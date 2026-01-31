package com.cinehub.backend.service;
import java.io.BufferedWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cinehub.backend.model.entity.Account;
import com.cinehub.backend.model.enums.Role;
import com.cinehub.backend.repository.AccountRepository;
@Service
public class AdminService {
        private final AccountRepository accountRepository;
     private final PasswordEncoder passwordEncoder;
     public AdminService(AccountRepository accountRepository,PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }
          public Account createStaff(Account account) {
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        account.setActive(true);
        return accountRepository.save(account);
    }

    public Account changeRole(Long id, Role role) {
        Account acc = getAccount(id);
        acc.setRole(role);
        return accountRepository.save(acc);
    }

    public Account lockAccount(Long id) {
        Account acc = getAccount(id);
        acc.setActive(false);
        return accountRepository.save(acc);
    }

    public Account unlockAccount(Long id) {
        Account acc = getAccount(id);
        acc.setActive(true);
        return accountRepository.save(acc);
    }

    private Account getAccount(Long id) {
        return accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
    }
    // Sao lưu dữ liệu
    public void backupDataToCSV(String filePath) {
        // Logic to back up data to CSV file
        List<Account> accounts = accountRepository.findAll();
        try (BufferedWriter writer = Files.newBufferedWriter(Paths.get(filePath))){
            writer.write("ID,username,role,active\n");
            for (Account acc : accounts) {
                writer.write(acc.getId() + "," +
                        acc.getUsername() + "," +
                        acc.getRole() + "," +
                        acc.isActive() + "\n");
            }
        }
        catch (Exception e) {
            throw new RuntimeException("Error writing to CSV file" + e.getMessage());
    }
    
    // Khôi phục dữ liệu
    
    // Quản lý người dùng

    //+ Quản lý tài khoản
    //+ Quản lý nhân viên quản lý rạp
    // Báo cáo và thống kê
    // + Xem doanh thu
    // + Thống kê lượt đặt vé 
} }
