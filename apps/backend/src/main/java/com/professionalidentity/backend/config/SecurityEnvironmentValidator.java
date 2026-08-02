package com.professionalidentity.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Validates critical environment variables on startup.
 * Fails fast if essential configuration properties (JWT Secret, Database URL) are missing.
 */
@Component
public class SecurityEnvironmentValidator implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SecurityEnvironmentValidator.class);

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${spring.datasource.url:}")
    private String dbUrl;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Performing startup security environment validation...");

        if (!StringUtils.hasText(jwtSecret)) {
            log.error("FATAL: JWT Secret configuration (jwt.secret) is missing or blank!");
            throw new IllegalStateException("FATAL: JWT Secret configuration (jwt.secret) is missing or blank.");
        }

        if (jwtSecret.length() < 32) {
            log.warn("SECURITY WARNING: JWT Secret should be at least 256 bits (32 characters) for HMAC-SHA256 strength.");
        }

        if (!StringUtils.hasText(dbUrl)) {
            log.error("FATAL: Database URL configuration (spring.datasource.url) is missing or blank!");
            throw new IllegalStateException("FATAL: Database URL configuration is missing or blank.");
        }

        log.info("Startup security environment validation PASSED.");
    }
}
