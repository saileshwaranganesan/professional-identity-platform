package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.CreateSocialLinkRequest;
import com.professionalidentity.backend.dto.request.UpdateSocialLinkRequest;
import com.professionalidentity.backend.dto.response.SocialLinkResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.SocialLink;
import com.professionalidentity.backend.exception.SocialLinkNotFoundException;
import com.professionalidentity.backend.mapper.SocialLinkMapper;
import com.professionalidentity.backend.repository.SocialLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;
    private final CurrentUserService currentUserService;
    private final SocialLinkMapper socialLinkMapper;

    public SocialLinkService(
            SocialLinkRepository socialLinkRepository,
            CurrentUserService currentUserService,
            SocialLinkMapper socialLinkMapper
    ) {
        this.socialLinkRepository = socialLinkRepository;
        this.currentUserService = currentUserService;
        this.socialLinkMapper = socialLinkMapper;
    }

    @Transactional
    public SocialLinkResponse createSocialLink(CreateSocialLinkRequest request) {
        Profile profile = currentUserService.getCurrentProfile();
        SocialLink socialLink = socialLinkMapper.toEntity(request, profile);
        return save(socialLink);
    }

    @Transactional(readOnly = true)
    public List<SocialLinkResponse> getSocialLinks() {
        return socialLinkRepository.findByProfileId(currentUserService.getCurrentProfile().getId()).stream()
                .map(socialLinkMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SocialLinkResponse getSocialLink(UUID socialLinkId) {
        return socialLinkMapper.toResponse(getSocialLinkOrThrow(currentUserService.getCurrentProfile().getId(), socialLinkId));
    }

    @Transactional
    public SocialLinkResponse updateSocialLink(
            UUID socialLinkId,
            UpdateSocialLinkRequest request
    ) {
        SocialLink socialLink = getSocialLinkOrThrow(currentUserService.getCurrentProfile().getId(), socialLinkId);
        socialLinkMapper.updateEntity(socialLink, request);
        return save(socialLink);
    }

    @Transactional
    public void deleteSocialLink(UUID socialLinkId) {
        socialLinkRepository.delete(getSocialLinkOrThrow(currentUserService.getCurrentProfile().getId(), socialLinkId));
    }

    private SocialLink getSocialLinkOrThrow(UUID profileId, UUID socialLinkId) {
        return socialLinkRepository.findByIdAndProfileId(socialLinkId, profileId)
                .orElseThrow(() -> new SocialLinkNotFoundException(socialLinkId));
    }

    private SocialLinkResponse save(SocialLink socialLink) {
        return socialLinkMapper.toResponse(socialLinkRepository.save(socialLink));
    }
}
