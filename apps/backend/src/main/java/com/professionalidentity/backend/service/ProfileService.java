package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.UpdateProfileRequest;
import com.professionalidentity.backend.dto.response.ProfileResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.mapper.ProfileMapper;
import com.professionalidentity.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final CurrentUserService currentUserService;
    private final ProfileMapper profileMapper;

    public ProfileService(
            ProfileRepository profileRepository,
            CurrentUserService currentUserService,
            ProfileMapper profileMapper
    ) {
        this.profileRepository = profileRepository;
        this.currentUserService = currentUserService;
        this.profileMapper = profileMapper;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile() {
        Profile profile = currentUserService.getCurrentProfile();
        return profileMapper.toResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(UpdateProfileRequest request) {
        Profile profile = currentUserService.getCurrentProfile();

        if (request.getUsername() != null && !request.getUsername().equalsIgnoreCase(profile.getUsername())) {
            if (profileRepository.existsByUsernameAndIdNot(request.getUsername(), profile.getId())) {
                throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
            }
        }

        profileMapper.updateEntity(profile, request);
        Profile updatedProfile = profileRepository.save(profile);
        return profileMapper.toResponse(updatedProfile);
    }
}
