package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.CreateEducationRequest;
import com.professionalidentity.backend.dto.request.UpdateEducationRequest;
import com.professionalidentity.backend.dto.response.EducationResponse;
import com.professionalidentity.backend.entity.Education;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.exception.EducationNotFoundException;
import com.professionalidentity.backend.mapper.EducationMapper;
import com.professionalidentity.backend.repository.EducationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EducationService {

    private final EducationRepository educationRepository;
    private final CurrentUserService currentUserService;
    private final EducationMapper educationMapper;

    public EducationService(
            EducationRepository educationRepository,
            CurrentUserService currentUserService,
            EducationMapper educationMapper
    ) {
        this.educationRepository = educationRepository;
        this.currentUserService = currentUserService;
        this.educationMapper = educationMapper;
    }

    @Transactional
    public EducationResponse createEducation(CreateEducationRequest request) {
        Profile profile = currentUserService.getCurrentProfile();
        Education education = educationMapper.toEntity(request, profile);
        return save(education);
    }

    @Transactional(readOnly = true)
    public List<EducationResponse> getEducations() {
        return educationRepository.findByProfileId(currentUserService.getCurrentProfile().getId()).stream()
                .map(educationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EducationResponse getEducation(UUID educationId) {
        return educationMapper.toResponse(getEducationOrThrow(currentUserService.getCurrentProfile().getId(), educationId));
    }

    @Transactional
    public EducationResponse updateEducation(
            UUID educationId,
            UpdateEducationRequest request
    ) {
        Education education = getEducationOrThrow(currentUserService.getCurrentProfile().getId(), educationId);
        educationMapper.updateEntity(education, request);
        return save(education);
    }

    @Transactional
    public void deleteEducation(UUID educationId) {
        educationRepository.delete(getEducationOrThrow(currentUserService.getCurrentProfile().getId(), educationId));
    }

    private Education getEducationOrThrow(UUID profileId, UUID educationId) {
        return educationRepository.findByIdAndProfileId(educationId, profileId)
                .orElseThrow(() -> new EducationNotFoundException(educationId));
    }

    private EducationResponse save(Education education) {
        return educationMapper.toResponse(educationRepository.save(education));
    }
}
