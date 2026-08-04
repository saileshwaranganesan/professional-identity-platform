package com.professionalidentity.backend.security;

import com.professionalidentity.backend.config.JwtProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class JwtCookieUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtCookieUtil.class);

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

    @jakarta.annotation.PostConstruct
    public void logResolvedConfiguration() {
        log.info("JWT COOKIE CONFIG\nsecure={}\nsameSite={}\npartitioned={}\nexpiration={}",
                secure, sameSite, partitioned, expiration);
    }

    public ResponseCookie createJwtCookie(String token) {
        ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(expiration)
                .sameSite(sameSite)
                .partitioned(partitioned)
                .build();

        log.info("[COOKIE]\nname={}\ndomain=host-only\npath={}\nsecure={}\nsameSite={}\npartitioned={}",
                COOKIE_NAME, cookie.getPath(), cookie.isSecure(), cookie.getSameSite(), cookie.isPartitioned());

        return cookie;
    }

    public ResponseCookie createCleanJwtCookie() {
        ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .partitioned(partitioned)
                .build();

        log.info("[COOKIE DELETE]\nname={}\ndomain=host-only\npath={}\nsecure={}\nsameSite={}\npartitioned={}",
                COOKIE_NAME, cookie.getPath(), cookie.isSecure(), cookie.getSameSite(), cookie.isPartitioned());

        return cookie;
    }
}
