package com.manifessto.backend.controller;

import com.manifessto.backend.dto.AdminLoginRequest;
import com.manifessto.backend.dto.AdminLoginResponse;
import com.manifessto.backend.entity.Admin;
import com.manifessto.backend.service.AdminService;
import com.manifessto.backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final JwtService jwtService;

    public AdminController(
            AdminService adminService,
            JwtService jwtService
    ) {
        this.adminService = adminService;
        this.jwtService = jwtService;
    }

    // =========================
    // ADMIN LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AdminLoginRequest request
    ) {

        Admin admin =
                adminService.findByEmail(
                        request.getEmail()
                );

        if (admin == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        boolean passwordValid =
                adminService.verifyPassword(
                        request.getPassword(),
                        admin.getPassword()
                );

        if (!passwordValid) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String token =
                jwtService.generateToken(
                        admin.getEmail()
                );

        AdminLoginResponse response =
                new AdminLoginResponse(
                        token,
                        admin.getEmail()
                );

        return ResponseEntity.ok(response);
    }
}