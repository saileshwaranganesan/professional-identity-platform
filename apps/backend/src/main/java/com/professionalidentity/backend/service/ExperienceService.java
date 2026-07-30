package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.CreateExperienceRequest;
import com.professionalidentity.backend.dto.request.UpdateExperienceRequest;
import com.professionalidentity.backend.dto.response.ExperienceResponse;
import com.professionalidentity.backend.entity.Experience;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.enums.EmploymentStatus;
import com.professionalidentity.backend.exception.BadRequestException;
import com.professionalidentity.backend.exception.ExperienceNotFoundException;
import com.professionalidentity.backend.exception.ProfileNotFoundException;
import com.professionalidentity.backend.mapper.ExperienceMapper;
import com.professionalidentity.backend.repository.ExperienceRepository;
import com.professionalidentity.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final ProfileRepository profileRepository;
    private final ExperienceMapper experienceMapper;

    public ExperienceService(
            ExperienceRepository experienceRepository,
            ProfileRepository profileRepository,
            ExperienceMapper experienceMapper
    ) {
        this.experienceRepository = experienceRepository;
        this.profileRepository = profileRepository;
        this.experienceMapper = experienceMapper;
    }

    @Transactional
    public ExperienceResponse createExperience(UUID profileId, CreateExperienceRequest request) {
        validateEmploymentPeriod(
                request.getStartDate(),
                request.getEndDate(),
                request.getCurrentlyWorking(),
                request.getEmploymentStatus()
        );

        Profile profile = getProfileOrThrow(profileId);
        Experience experience = new Experience();
        experience.setProfile(profile);
        experienceMapper.populateEntity(experience, request);

        if (request.getDisplayOrder() == null) {
            experience.setDisplayOrder(experienceRepository.findByProfileIdOrderByDisplayOrderAsc(profileId).size());
        } else {
            placeAtDisplayOrder(experience, request.getDisplayOrder());
        }

        return save(experience);
    }

    @Transactional
    public ExperienceResponse updateExperience(UUID experienceId, UpdateExperienceRequest request) {
        validateEmploymentPeriod(
                request.getStartDate(),
                request.getEndDate(),
                request.getCurrentlyWorking(),
                request.getEmploymentStatus()
        );

        Experience experience = getExperienceOrThrow(experienceId);
        experienceMapper.updateEntity(experience, request);

        if (request.getDisplayOrder() != null) {
            placeAtDisplayOrder(experience, request.getDisplayOrder());
        }

        return save(experience);
    }

    @Transactional(readOnly = true)
    public ExperienceResponse getExperience(UUID experienceId) {
        return experienceMapper.toResponse(getExperienceOrThrow(experienceId));
    }

    @Transactional(readOnly = true)
    public List<ExperienceResponse> getExperiencesByProfile(UUID profileId) {
        getProfileOrThrow(profileId);
        return experienceMapper.toResponseList(
                experienceRepository.findByProfileIdOrderByDisplayOrderAsc(profileId)
        );
    }

    @Transactional
    public void deleteExperience(UUID experienceId) {
        Experience experience = getExperienceOrThrow(experienceId);
        List<Experience> remainingExperiences = new ArrayList<>(
                experienceRepository.findByProfileIdOrderByDisplayOrderAsc(experience.getProfile().getId())
        );
        remainingExperiences.removeIf(item -> item.getId().equals(experienceId));
        assignDisplayOrders(remainingExperiences);
        experienceRepository.delete(experience);
    }

    private Experience getExperienceOrThrow(UUID experienceId) {
        return experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ExperienceNotFoundException(experienceId));
    }

    private Profile getProfileOrThrow(UUID profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> new ProfileNotFoundException(profileId));
    }

    private void validateEmploymentPeriod(
            LocalDate startDate,
            LocalDate endDate,
            Boolean currentlyWorking,
            EmploymentStatus employmentStatus
    ) {
        if (startDate == null || currentlyWorking == null || employmentStatus == null) {
            throw new BadRequestException("Experience employment details are required.");
        }

        if (Boolean.TRUE.equals(currentlyWorking)) {
            if (endDate != null) {
                throw new BadRequestException("End date must be null when currently working is true.");
            }
            if (employmentStatus != EmploymentStatus.CURRENT) {
                throw new BadRequestException("Employment status must be CURRENT when currently working is true.");
            }
            return;
        }

        if (endDate == null) {
            throw new BadRequestException("End date is required when currently working is false.");
        }
        if (employmentStatus != EmploymentStatus.PREVIOUS) {
            throw new BadRequestException("Employment status must be PREVIOUS when currently working is false.");
        }
        if (endDate.isBefore(startDate)) {
            throw new BadRequestException("End date must not be before start date.");
        }
    }

    private void placeAtDisplayOrder(Experience experience, int requestedDisplayOrder) {
        List<Experience> experiences = new ArrayList<>(
                experienceRepository.findByProfileIdOrderByDisplayOrderAsc(experience.getProfile().getId())
        );
        if (experience.getId() != null) {
            experiences.removeIf(item -> item.getId().equals(experience.getId()));
        }

        int targetDisplayOrder = Math.min(requestedDisplayOrder, experiences.size());
        experiences.add(targetDisplayOrder, experience);
        assignDisplayOrders(experiences);
    }

    private void assignDisplayOrders(List<Experience> experiences) {
        for (int index = 0; index < experiences.size(); index++) {
            experiences.get(index).setDisplayOrder(index);
        }
    }

    private ExperienceResponse save(Experience experience) {
        return experienceMapper.toResponse(experienceRepository.save(experience));
    }
}
