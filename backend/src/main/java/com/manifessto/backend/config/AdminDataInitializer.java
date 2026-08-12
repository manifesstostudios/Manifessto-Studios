package com.manifessto.backend.config;

import com.manifessto.backend.repository.AdminRepository;
import com.manifessto.backend.service.AdminService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminDataInitializer {

    @Bean
    public CommandLineRunner createDefaultAdmin(
            AdminRepository adminRepository,
            AdminService adminService
    ) {

        return args -> {

            if (adminRepository.count() == 0) {

                adminService.createAdmin(
                        "admin@manifessto.com",
                        "ChangeThisPassword123!"
                );

                System.out.println(
                        "Default admin account created."
                );

            }

        };
    }
}