package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.response.ProfileCompletionResponse;
import com.professionalidentity.backend.service.ProfileCompletionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Profile Completion", description = "Calculate completion for the authenticated user's profile.")
@RequestMapping(ApplicationConstants.API_PREFIX + "/profile/completion")
public class ProfileCompletionController {

    private final ProfileCompletionService profileCompletionService;

    public ProfileCompletionController(ProfileCompletionService profileCompletionService) {
        this.profileCompletionService = profileCompletionService;
    }

    @GetMapping
    public ResponseEntity<ProfileCompletionResponse> calculateCompletion() {
        return ResponseEntity.ok(profileCompletionService.calculateCompletion());
    }
}
