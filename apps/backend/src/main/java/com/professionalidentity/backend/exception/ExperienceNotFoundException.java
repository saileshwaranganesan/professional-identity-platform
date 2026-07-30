package com.professionalidentity.backend.exception;

import java.util.UUID;

public class ExperienceNotFoundException extends RuntimeException {

    public ExperienceNotFoundException(UUID experienceId) {
        super("Experience not found with id: " + experienceId);
    }
}
