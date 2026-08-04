package com.professionalidentity.backend.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @Size(max = 100, message = "Username must not exceed 100 characters")
    @Pattern(regexp = "^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$", message = "Username must contain only alphanumeric characters, dots, underscores, or hyphens")
    private String username;

    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Size(max = 255, message = "Headline must not exceed 255 characters")
    private String headline;

    @Size(max = 5000, message = "Bio must not exceed 5000 characters")
    private String bio;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Size(max = 512, message = "Website URL must not exceed 512 characters")
    private String website;

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @Size(max = 512, message = "Profile image path must not exceed 512 characters")
    private String profileImagePath;

    @Size(max = 512, message = "Banner image path must not exceed 512 characters")
    private String bannerImagePath;
}
