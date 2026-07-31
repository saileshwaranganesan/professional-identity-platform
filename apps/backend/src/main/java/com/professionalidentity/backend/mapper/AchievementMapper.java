package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateAchievementRequest;
import com.professionalidentity.backend.dto.request.UpdateAchievementRequest;
import com.professionalidentity.backend.dto.response.AchievementResponse;
import com.professionalidentity.backend.entity.Achievement;
import com.professionalidentity.backend.entity.Profile;
import org.springframework.stereotype.Component;

@Component
public class AchievementMapper {

    public Achievement toEntity(CreateAchievementRequest request, Profile profile) {
        Achievement achievement = new Achievement();
        achievement.setTitle(request.getTitle());
        achievement.setOrganization(request.getOrganization());
        achievement.setAchievementDate(request.getAchievementDate());
        achievement.setDescription(request.getDescription());
        achievement.setAchievementUrl(request.getAchievementUrl());
        achievement.setDisplayOrder(request.getDisplayOrder());
        achievement.setProfile(profile);
        return achievement;
    }

    public AchievementResponse toResponse(Achievement achievement) {
        AchievementResponse response = new AchievementResponse();
        response.setId(achievement.getId());
        response.setTitle(achievement.getTitle());
        response.setOrganization(achievement.getOrganization());
        response.setAchievementDate(achievement.getAchievementDate());
        response.setDescription(achievement.getDescription());
        response.setAchievementUrl(achievement.getAchievementUrl());
        response.setDisplayOrder(achievement.getDisplayOrder());
        response.setCreatedAt(achievement.getCreatedAt());
        response.setUpdatedAt(achievement.getUpdatedAt());
        return response;
    }

    public void updateEntity(Achievement achievement, UpdateAchievementRequest request) {
        achievement.setTitle(request.getTitle());
        achievement.setOrganization(request.getOrganization());
        achievement.setAchievementDate(request.getAchievementDate());
        achievement.setDescription(request.getDescription());
        achievement.setAchievementUrl(request.getAchievementUrl());
        achievement.setDisplayOrder(request.getDisplayOrder());
    }
}
