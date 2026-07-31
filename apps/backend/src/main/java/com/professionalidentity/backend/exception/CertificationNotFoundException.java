package com.professionalidentity.backend.exception;

import java.util.UUID;

public class CertificationNotFoundException extends RuntimeException {

    public CertificationNotFoundException(UUID certificationId) {
        super("Certification not found with id: " + certificationId);
    }
}
