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

                .cors(cors -> {
                })


                // =====================================================
                // CSRF
                // JWT based REST API
                // =====================================================

                .csrf(csrf -> csrf.disable())


                // =====================================================
                // SESSION MANAGEMENT
                // JWT = STATELESS
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


                        // =================================================
                        // CORS PREFLIGHT REQUESTS
                        // =================================================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // =================================================
                        // ADMIN LOGIN
                        // PUBLIC
                        // =================================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/admin/login"
                        ).permitAll()


                        // =================================================
                        // PUBLIC REVIEWS
                        // =================================================

                        // Anyone can view reviews

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/reviews"
                        ).permitAll()


                        // Anyone can submit reviews

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/reviews"
                        ).permitAll()


                        // =================================================
                        // PUBLIC GET APIs
                        // =================================================

                        // Website ka public content

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/**"
                        ).permitAll()


                        // =================================================
                        // ADMIN ONLY - POST
                        // =================================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/**"
                        ).hasRole("ADMIN")


                        // =================================================
                        // ADMIN ONLY - PUT
                        // =================================================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/**"
                        ).hasRole("ADMIN")


                        // =================================================
                        // ADMIN ONLY - PATCH
                        // =================================================

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/**"
                        ).hasRole("ADMIN")


                        // =================================================
                        // ADMIN ONLY - DELETE
                        // =================================================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/**"
                        ).hasRole("ADMIN")


                        // =================================================
                        // EVERYTHING ELSE
                        // =================================================

                        .anyRequest().permitAll()
                )


                // =====================================================
                // JWT FILTER
                // =====================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )


                // =====================================================
                // DISABLE DEFAULT AUTHENTICATION
                // =====================================================

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable());


        return http.build();
    }
}