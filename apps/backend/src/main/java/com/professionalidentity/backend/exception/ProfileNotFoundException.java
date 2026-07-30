package com.professionalidentity.backend.exception;

import java.util.UUID;

public class ProfileNotFoundException extends RuntimeException {

    public ProfileNotFoundException(UUID profileId) {
        super("Profile not found with id: " + profileId);
    }
}
