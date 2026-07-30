package com.professionalidentity.backend.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "admin")
public record AdminProperties(
        @NotBlank String name,
        @NotBlank String email,
        @NotBlank String password
) {
}
