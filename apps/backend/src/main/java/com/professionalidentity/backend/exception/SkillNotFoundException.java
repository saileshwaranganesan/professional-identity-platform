package com.professionalidentity.backend.exception;

import java.util.UUID;

public class SkillNotFoundException extends RuntimeException {

    public SkillNotFoundException(UUID skillId) {
        super("Skill not found with id: " + skillId);
    }
}
