package com.professionalidentity.backend.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ProfileResponse {

    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    private String headline;
    private String bio;
    private String location;
    private String website;
    private String phone;
    private String profileImagePath;
    private String bannerImagePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
