package com.professionalidentity.backend.exception;

import java.util.UUID;

public class EducationNotFoundException extends RuntimeException {

    public EducationNotFoundException(UUID educationId) {
        super("Education not found with id: " + educationId);
    }
}
