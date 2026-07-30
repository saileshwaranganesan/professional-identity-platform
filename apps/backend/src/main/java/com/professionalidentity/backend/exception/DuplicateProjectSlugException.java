package com.professionalidentity.backend.exception;

public class DuplicateProjectSlugException extends RuntimeException {

    public DuplicateProjectSlugException(String slug) {
        super("A project already exists with slug: " + slug);
    }
}
