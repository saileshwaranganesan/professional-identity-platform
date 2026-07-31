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
}
