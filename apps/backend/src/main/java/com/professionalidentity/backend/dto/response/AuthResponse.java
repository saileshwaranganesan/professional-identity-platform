package com.professionalidentity.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class AuthResponse {

    private final String accessToken;
    private final String tokenType;
    private final long expiresIn;
    private final UUID userId;
    private final String email;
    private final String role;
}
