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
    private final boolean partitioned;

    public JwtCookieUtil(
            JwtProperties jwtProperties,
            @Value("${jwt.cookie.secure:false}") boolean secure,
            @Value("${jwt.cookie.same-site:Lax}") String sameSite,
            @Value("${jwt.cookie.partitioned:false}") boolean partitioned
    ) {
        this.expiration = jwtProperties.expiration();
        this.secure = secure;
        this.sameSite = sameSite;
        this.partitioned = partitioned;
    }

    public ResponseCookie createJwtCookie(String token) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(expiration)
                .sameSite(sameSite)
                .partitioned(partitioned)
                .build();
    }

    public ResponseCookie createCleanJwtCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .partitioned(partitioned)
                .build();
    }
}
