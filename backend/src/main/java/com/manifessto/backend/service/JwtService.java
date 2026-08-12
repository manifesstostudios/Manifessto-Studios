package com.manifessto.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration
    ) {

        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expiration = expiration;
    }

    // =========================
    // GENERATE TOKEN
    // =========================

    public String generateToken(String email) {

        Date now = new Date();

        Date expiryDate =
                new Date(
                        now.getTime() + expiration
                );

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    // =========================
    // EXTRACT EMAIL
    // =========================

    public String extractEmail(String token) {

        return getClaims(token)
                .getSubject();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================

    public boolean isTokenValid(
            String token,
            String email
    ) {

        try {

            String tokenEmail =
                    extractEmail(token);

            return tokenEmail.equals(email)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            return false;
        }
    }

    // =========================
    // CHECK EXPIRATION
    // =========================

    private boolean isTokenExpired(
            String token
    ) {

        return getClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // =========================
    // GET CLAIMS
    // =========================

    private Claims getClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}