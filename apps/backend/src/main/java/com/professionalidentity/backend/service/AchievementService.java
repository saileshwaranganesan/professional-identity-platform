package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.CreateAchievementRequest;
import com.professionalidentity.backend.dto.request.UpdateAchievementRequest;
import com.professionalidentity.backend.dto.response.AchievementResponse;
import com.professionalidentity.backend.entity.Achievement;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.exception.AchievementNotFoundException;
import com.professionalidentity.backend.mapper.AchievementMapper;
import com.professionalidentity.backend.repository.AchievementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final CurrentUserService currentUserService;
    private final AchievementMapper achievementMapper;

    public AchievementService(
            AchievementRepository achievementRepository,
            CurrentUserService currentUserService,
            AchievementMapper achievementMapper
    ) {
        this.achievementRepository = achievementRepository;
        this.currentUserService = currentUserService;
        this.achievementMapper = achievementMapper;
    }

    @Transactional
    public AchievementResponse createAchievement(CreateAchievementRequest request) {
        Profile profile = currentUserService.getCurrentProfile();
        Achievement achievement = achievementMapper.toEntity(request, profile);
        return save(achievement);
    }

    @Transactional(readOnly = true)
    public List<AchievementResponse> getAchievements() {
        return achievementRepository.findByProfileIdOrderByDisplayOrderAsc(currentUserService.getCurrentProfile().getId()).stream()
                .map(achievementMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AchievementResponse getAchievement(UUID achievementId) {
        return achievementMapper.toResponse(getAchievementOrThrow(currentUserService.getCurrentProfile().getId(), achievementId));
    }

    @Transactional
    public AchievementResponse updateAchievement(
            UUID achievementId,
            UpdateAchievementRequest request
    ) {
        Achievement achievement = getAchievementOrThrow(currentUserService.getCurrentProfile().getId(), achievementId);
        achievementMapper.updateEntity(achievement, request);
        return save(achievement);
    }

    @Transactional
    public void deleteAchievement(UUID achievementId) {
        achievementRepository.delete(getAchievementOrThrow(currentUserService.getCurrentProfile().getId(), achievementId));
    }

    private Achievement getAchievementOrThrow(UUID profileId, UUID achievementId) {
        return achievementRepository.findByIdAndProfileId(achievementId, profileId)
                .orElseThrow(() -> new AchievementNotFoundException(achievementId));
    }

    private AchievementResponse save(Achievement achievement) {
        return achievementMapper.toResponse(achievementRepository.save(achievement));
    }
}
