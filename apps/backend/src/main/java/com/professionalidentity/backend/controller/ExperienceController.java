package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.request.CreateExperienceRequest;
import com.professionalidentity.backend.dto.request.UpdateExperienceRequest;
import com.professionalidentity.backend.dto.response.ExperienceResponse;
import com.professionalidentity.backend.service.ExperienceService;
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
@Tag(name = "Experience", description = "Manage work experience in the authenticated user's profile.")
@RequestMapping(ApplicationConstants.API_PREFIX + "/experiences")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @PostMapping
    public ResponseEntity<ExperienceResponse> createExperience(@Valid @RequestBody CreateExperienceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(experienceService.createExperience(request));
    }

    @PutMapping("/{experienceId}")
    public ResponseEntity<ExperienceResponse> updateExperience(
            @PathVariable UUID experienceId,
            @Valid @RequestBody UpdateExperienceRequest request
    ) {
        return ResponseEntity.ok(experienceService.updateExperience(experienceId, request));
    }

    @GetMapping
    public ResponseEntity<List<ExperienceResponse>> getExperiencesByProfile() {
        return ResponseEntity.ok(experienceService.getExperiencesByProfile());
    }

    @GetMapping("/{experienceId}")
    public ResponseEntity<ExperienceResponse> getExperience(@PathVariable UUID experienceId) {
        return ResponseEntity.ok(experienceService.getExperience(experienceId));
    }

    @DeleteMapping("/{experienceId}")
    public ResponseEntity<Void> deleteExperience(@PathVariable UUID experienceId) {
        experienceService.deleteExperience(experienceId);
        return ResponseEntity.noContent().build();
    }
}
