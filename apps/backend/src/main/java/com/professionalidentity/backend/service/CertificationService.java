package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.CreateCertificationRequest;
import com.professionalidentity.backend.dto.request.UpdateCertificationRequest;
import com.professionalidentity.backend.dto.response.CertificationResponse;
import com.professionalidentity.backend.entity.Certification;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.exception.CertificationNotFoundException;
import com.professionalidentity.backend.mapper.CertificationMapper;
import com.professionalidentity.backend.repository.CertificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final CurrentUserService currentUserService;
    private final CertificationMapper certificationMapper;

    public CertificationService(
            CertificationRepository certificationRepository,
            CurrentUserService currentUserService,
            CertificationMapper certificationMapper
    ) {
        this.certificationRepository = certificationRepository;
        this.currentUserService = currentUserService;
        this.certificationMapper = certificationMapper;
    }

    @Transactional
    public CertificationResponse createCertification(CreateCertificationRequest request) {
        Profile profile = currentUserService.getCurrentProfile();
        Certification certification = certificationMapper.toEntity(request, profile);
        return save(certification);
    }

    @Transactional(readOnly = true)
    public List<CertificationResponse> getCertifications() {
        return certificationRepository.findByProfileId(currentUserService.getCurrentProfile().getId()).stream()
                .map(certificationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CertificationResponse getCertification(UUID certificationId) {
        return certificationMapper.toResponse(getCertificationOrThrow(currentUserService.getCurrentProfile().getId(), certificationId));
    }

    @Transactional
    public CertificationResponse updateCertification(
            UUID certificationId,
            UpdateCertificationRequest request
    ) {
        Certification certification = getCertificationOrThrow(currentUserService.getCurrentProfile().getId(), certificationId);
        certificationMapper.updateEntity(certification, request);
        return save(certification);
    }

    @Transactional
    public void deleteCertification(UUID certificationId) {
        certificationRepository.delete(getCertificationOrThrow(currentUserService.getCurrentProfile().getId(), certificationId));
    }

    private Certification getCertificationOrThrow(UUID profileId, UUID certificationId) {
        return certificationRepository.findByIdAndProfileId(certificationId, profileId)
                .orElseThrow(() -> new CertificationNotFoundException(certificationId));
    }

    private CertificationResponse save(Certification certification) {
        return certificationMapper.toResponse(certificationRepository.save(certification));
    }
}
