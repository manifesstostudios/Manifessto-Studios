package com.manifessto.backend.dto;

public class AdminLoginResponse {

    private String token;
    private String email;

    public AdminLoginResponse() {
    }

    public AdminLoginResponse(
            String token,
            String email
    ) {
        this.token = token;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}