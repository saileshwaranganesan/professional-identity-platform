package com.professionalidentity.backend.security;

import com.professionalidentity.backend.config.JwtProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class JwtCookieUtil {

    public static final String COOKIE_NAME = "jwt";

    private final Duration expiration;
    private final boolean secure;
    private final String sameSite;

    public JwtCookieUtil(
            JwtProperties jwtProperties,
            @Value("${jwt.cookie.secure:true}") boolean secure,
            @Value("${jwt.cookie.same-site:None}") String sameSite
    ) {
        this.expiration = jwtProperties.expiration();
        this.secure = secure;
        this.sameSite = sameSite;
    }

    public ResponseCookie createJwtCookie(String token) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(expiration)
                .sameSite(sameSite)
                .build();
    }

    public ResponseCookie createCleanJwtCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .build();
    }
}
