package com.professionalidentity.backend.exception;

public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException() {
        super("Authentication is required.");
    }
}
