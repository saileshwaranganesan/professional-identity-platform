package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateSocialLinkRequest;
import com.professionalidentity.backend.dto.request.UpdateSocialLinkRequest;
import com.professionalidentity.backend.dto.response.SocialLinkResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.SocialLink;
import org.springframework.stereotype.Component;

@Component
public class SocialLinkMapper {

    public SocialLink toEntity(CreateSocialLinkRequest request, Profile profile) {
        SocialLink socialLink = new SocialLink();
        socialLink.setPlatform(request.getPlatform());
        socialLink.setUrl(request.getUrl());
        socialLink.setDisplayOrder(request.getDisplayOrder());
        socialLink.setProfile(profile);
        return socialLink;
    }

    public SocialLinkResponse toResponse(SocialLink socialLink) {
        SocialLinkResponse response = new SocialLinkResponse();
        response.setId(socialLink.getId());
        response.setPlatform(socialLink.getPlatform());
        response.setUrl(socialLink.getUrl());
        response.setDisplayOrder(socialLink.getDisplayOrder());
        response.setCreatedAt(socialLink.getCreatedAt());
        response.setUpdatedAt(socialLink.getUpdatedAt());
        return response;
    }

    public void updateEntity(SocialLink socialLink, UpdateSocialLinkRequest request) {
        socialLink.setPlatform(request.getPlatform());
        socialLink.setUrl(request.getUrl());
        socialLink.setDisplayOrder(request.getDisplayOrder());
    }
}
