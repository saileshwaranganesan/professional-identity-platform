package com.professionalidentity.backend.exception;

import java.util.UUID;

public class SocialLinkNotFoundException extends RuntimeException {

    public SocialLinkNotFoundException(UUID socialLinkId) {
        super("Social link not found with id: " + socialLinkId);
    }
}
