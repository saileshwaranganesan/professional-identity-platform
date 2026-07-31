package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.request.CreateSocialLinkRequest;
import com.professionalidentity.backend.dto.request.UpdateSocialLinkRequest;
import com.professionalidentity.backend.dto.response.SocialLinkResponse;
import com.professionalidentity.backend.service.SocialLinkService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Social Links", description = "Manage social links in the authenticated user's profile.")
@RequestMapping(ApplicationConstants.API_PREFIX + "/social-links")
public class SocialLinkController {

    private final SocialLinkService socialLinkService;

    public SocialLinkController(SocialLinkService socialLinkService) {
        this.socialLinkService = socialLinkService;
    }

    @PostMapping
    public ResponseEntity<SocialLinkResponse> createSocialLink(@Valid @RequestBody CreateSocialLinkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(socialLinkService.createSocialLink(request));
    }

    @GetMapping
    public ResponseEntity<List<SocialLinkResponse>> getSocialLinks() {
        return ResponseEntity.ok(socialLinkService.getSocialLinks());
    }

    @GetMapping("/{socialLinkId}")
    public ResponseEntity<SocialLinkResponse> getSocialLink(
            @PathVariable UUID socialLinkId
    ) {
        return ResponseEntity.ok(socialLinkService.getSocialLink(socialLinkId));
    }

    @PutMapping("/{socialLinkId}")
    public ResponseEntity<SocialLinkResponse> updateSocialLink(
            @PathVariable UUID socialLinkId,
            @Valid @RequestBody UpdateSocialLinkRequest request
    ) {
        return ResponseEntity.ok(socialLinkService.updateSocialLink(socialLinkId, request));
    }

    @DeleteMapping("/{socialLinkId}")
    public ResponseEntity<Void> deleteSocialLink(
            @PathVariable UUID socialLinkId
    ) {
        socialLinkService.deleteSocialLink(socialLinkId);
        return ResponseEntity.noContent().build();
    }
}
