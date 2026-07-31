package com.professionalidentity.backend.exception;

import java.util.UUID;

public class AchievementNotFoundException extends RuntimeException {

    public AchievementNotFoundException(UUID achievementId) {
        super("Achievement not found with id: " + achievementId);
    }
}
