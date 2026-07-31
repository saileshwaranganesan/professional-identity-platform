package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.request.CreateEducationRequest;
import com.professionalidentity.backend.dto.request.UpdateEducationRequest;
import com.professionalidentity.backend.dto.response.EducationResponse;
import com.professionalidentity.backend.service.EducationService;
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
@Tag(name = "Education", description = "Manage education records in the authenticated user's profile.")
@RequestMapping(ApplicationConstants.API_PREFIX + "/educations")
public class EducationController {

    private final EducationService educationService;

    public EducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    @PostMapping
    public ResponseEntity<EducationResponse> createEducation(@Valid @RequestBody CreateEducationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(educationService.createEducation(request));
    }

    @GetMapping
    public ResponseEntity<List<EducationResponse>> getEducations() {
        return ResponseEntity.ok(educationService.getEducations());
    }

    @GetMapping("/{educationId}")
    public ResponseEntity<EducationResponse> getEducation(
            @PathVariable UUID educationId
    ) {
        return ResponseEntity.ok(educationService.getEducation(educationId));
    }

    @PutMapping("/{educationId}")
    public ResponseEntity<EducationResponse> updateEducation(
            @PathVariable UUID educationId,
            @Valid @RequestBody UpdateEducationRequest request
    ) {
        return ResponseEntity.ok(educationService.updateEducation(educationId, request));
    }

    @DeleteMapping("/{educationId}")
    public ResponseEntity<Void> deleteEducation(
            @PathVariable UUID educationId
    ) {
        educationService.deleteEducation(educationId);
        return ResponseEntity.noContent().build();
    }
}
