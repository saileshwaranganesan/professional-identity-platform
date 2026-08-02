package com.professionalidentity.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class UserResponse {

    private final UUID id;
    private final String email;
    private final String role;
    private final String username;
    private final String firstName;
    private final String lastName;
}
