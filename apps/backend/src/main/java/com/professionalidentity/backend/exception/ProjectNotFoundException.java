package com.professionalidentity.backend.exception;

import java.util.UUID;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException(UUID projectId) {
        super("Project not found with id: " + projectId);
    }

    public ProjectNotFoundException(String slug) {
        super("Published project not found with slug: " + slug);
    }
}
