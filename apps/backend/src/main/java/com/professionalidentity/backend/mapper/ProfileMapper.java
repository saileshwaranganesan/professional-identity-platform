package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.response.ProfileResponse;
import com.professionalidentity.backend.entity.Profile;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

    public ProfileResponse toResponse(Profile profile) {
        ProfileResponse response = new ProfileResponse();
        response.setId(profile.getId());
        response.setUsername(profile.getUsername());
        response.setFirstName(profile.getFirstName());
        response.setLastName(profile.getLastName());
        response.setHeadline(profile.getHeadline());
        response.setBio(profile.getBio());
        response.setLocation(profile.getLocation());
        response.setWebsite(profile.getWebsite());
        response.setPhone(profile.getPhone());
        response.setProfileImagePath(profile.getProfileImagePath());
        response.setBannerImagePath(profile.getBannerImagePath());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }

    public void updateEntity(Profile profile, com.professionalidentity.backend.dto.request.UpdateProfileRequest request) {
        if (request.getUsername() != null) {
            profile.setUsername(request.getUsername());
        }
        if (request.getFirstName() != null) {
            profile.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            profile.setLastName(request.getLastName());
        }
        if (request.getHeadline() != null) {
            profile.setHeadline(request.getHeadline());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation());
        }
        if (request.getWebsite() != null) {
            profile.setWebsite(request.getWebsite());
        }
        if (request.getPhone() != null) {
            profile.setPhone(request.getPhone());
        }
        if (request.getProfileImagePath() != null) {
            profile.setProfileImagePath(request.getProfileImagePath());
        }
        if (request.getBannerImagePath() != null) {
            profile.setBannerImagePath(request.getBannerImagePath());
        }
    }
}
