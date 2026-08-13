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

                // ==============================
                // CORS
                // ==============================

                .cors(cors -> {})

                // ==============================
                // CSRF
                // ==============================

                .csrf(csrf -> csrf.disable())

                // ==============================
                // SESSION
                // ==============================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ==============================
                // AUTHORIZATION
                // ==============================

                .authorizeHttpRequests(auth -> auth

                        // --------------------------------
                        // CORS PREFLIGHT
                        // --------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // --------------------------------
                        // ADMIN LOGIN
                        // --------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/admin/login"
                        ).permitAll()

                        // --------------------------------
                        // PUBLIC GET APIs
                        // --------------------------------

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/**"
                        ).permitAll()

                        // --------------------------------
                        // PUBLIC REVIEW SUBMISSION
                        // --------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/reviews"
                        ).permitAll()

                        // --------------------------------
                        // ADMIN CREATE
                        // --------------------------------

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/**"
                        ).hasRole("ADMIN")

                        // --------------------------------
                        // ADMIN UPDATE
                        // --------------------------------

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/**"
                        ).hasRole("ADMIN")

                        // --------------------------------
                        // ADMIN PATCH
                        // --------------------------------

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/**"
                        ).hasRole("ADMIN")

                        // --------------------------------
                        // ADMIN DELETE
                        // --------------------------------

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/**"
                        ).hasRole("ADMIN")

                        // --------------------------------
                        // EVERYTHING ELSE
                        // --------------------------------

                        .anyRequest().permitAll()
                )

                // ==============================
                // JWT FILTER
                // ==============================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                // ==============================
                // DISABLE DEFAULT AUTH
                // ==============================

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}