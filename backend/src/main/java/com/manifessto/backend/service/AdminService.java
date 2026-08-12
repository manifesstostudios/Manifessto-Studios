package com.manifessto.backend.service;

import com.manifessto.backend.entity.Admin;
import com.manifessto.backend.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // FIND ADMIN BY EMAIL
    // =========================

    public Admin findByEmail(String email) {

        return adminRepository
                .findByEmail(email)
                .orElse(null);
    }

    // =========================
    // VERIFY ADMIN PASSWORD
    // =========================

    public boolean verifyPassword(
            String rawPassword,
            String encodedPassword
    ) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }

    // =========================
    // CREATE ADMIN
    // =========================

    public Admin createAdmin(
            String email,
            String rawPassword
    ) {

        if (adminRepository
                .findByEmail(email)
                .isPresent()) {

            throw new RuntimeException(
                    "Admin already exists"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(
                        rawPassword
                );

        Admin admin =
                new Admin(
                        email,
                        encodedPassword
                );

        return adminRepository.save(admin);
    }
}