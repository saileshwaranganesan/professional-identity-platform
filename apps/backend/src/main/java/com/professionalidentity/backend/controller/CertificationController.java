package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.request.CreateCertificationRequest;
import com.professionalidentity.backend.dto.request.UpdateCertificationRequest;
import com.professionalidentity.backend.dto.response.CertificationResponse;
import com.professionalidentity.backend.service.CertificationService;
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
@Tag(name = "Certifications", description = "Manage certifications in the authenticated user's profile.")
@RequestMapping(ApplicationConstants.API_PREFIX + "/certifications")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    @PostMapping
    public ResponseEntity<CertificationResponse> createCertification(@Valid @RequestBody CreateCertificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(certificationService.createCertification(request));
    }

    @GetMapping
    public ResponseEntity<List<CertificationResponse>> getCertifications() {
        return ResponseEntity.ok(certificationService.getCertifications());
    }

    @GetMapping("/{certificationId}")
    public ResponseEntity<CertificationResponse> getCertification(
            @PathVariable UUID certificationId
    ) {
        return ResponseEntity.ok(certificationService.getCertification(certificationId));
    }

    @PutMapping("/{certificationId}")
    public ResponseEntity<CertificationResponse> updateCertification(
            @PathVariable UUID certificationId,
            @Valid @RequestBody UpdateCertificationRequest request
    ) {
        return ResponseEntity.ok(certificationService.updateCertification(certificationId, request));
    }

    @DeleteMapping("/{certificationId}")
    public ResponseEntity<Void> deleteCertification(
            @PathVariable UUID certificationId
    ) {
        certificationService.deleteCertification(certificationId);
        return ResponseEntity.noContent().build();
    }
}
