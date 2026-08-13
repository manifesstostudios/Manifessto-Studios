package com.manifessto.backend.config;

import com.manifessto.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =====================================================
                // CORS
                // =====================================================

                .cors(cors -> {})

                // =====================================================
                // CSRF
                // JWT based API hai, isliye CSRF disable
                // =====================================================

                .csrf(csrf -> csrf.disable())

                // =====================================================
                // SESSION MANAGEMENT
                // JWT authentication ke saath stateless
                // =====================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =====================================================
                // AUTHORIZATION
                // =====================================================

                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------
                        // CORS PREFLIGHT REQUESTS
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // ADMIN LOGIN
                        // Login ke liye JWT nahi chahiye
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/admin/login"
                        ).permitAll()

                        // -------------------------------------------------
                        // PUBLIC GET APIs
                        // Website ke public data ke liye
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // ADMIN CREATE APIs
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/**"
                        ).hasRole("ADMIN")

                        // -------------------------------------------------
                        // ADMIN UPDATE APIs
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/**"
                        ).hasRole("ADMIN")

                        // -------------------------------------------------
                        // ADMIN PARTIAL UPDATE APIs
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/**"
                        ).hasRole("ADMIN")

                        // -------------------------------------------------
                        // ADMIN DELETE APIs
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/**"
                        ).hasRole("ADMIN")

                        // -------------------------------------------------
                        // EVERYTHING ELSE
                        // -------------------------------------------------

                        .anyRequest().permitAll()
                )

                // =====================================================
                // JWT AUTHENTICATION FILTER
                // =====================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                // =====================================================
                // DISABLE DEFAULT LOGIN MECHANISMS
                // =====================================================

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}