package com.professionalidentity.backend.security;

import com.professionalidentity.backend.config.JwtProperties;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class JwtCookieUtil {

    public static final String COOKIE_NAME = "jwt";

    private final Duration expiration;

    public JwtCookieUtil(JwtProperties jwtProperties) {
        this.expiration = jwtProperties.expiration();
    }

    public ResponseCookie createJwtCookie(String token) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false) // Set to true when running under HTTPS in production
                .path("/")
                .maxAge(expiration)
                .sameSite("Lax")
                .build();
    }

    public ResponseCookie createCleanJwtCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
    }
}
