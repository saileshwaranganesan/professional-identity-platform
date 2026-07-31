package com.professionalidentity.backend.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "admin")
public record AdminProperties(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank String password
) {
}
