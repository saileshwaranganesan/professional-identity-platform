package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateCertificationRequest;
import com.professionalidentity.backend.dto.request.UpdateCertificationRequest;
import com.professionalidentity.backend.dto.response.CertificationResponse;
import com.professionalidentity.backend.entity.Certification;
import com.professionalidentity.backend.entity.Profile;
import org.springframework.stereotype.Component;

@Component
public class CertificationMapper {

    public Certification toEntity(CreateCertificationRequest request, Profile profile) {
        Certification certification = new Certification();
        certification.setName(request.getName());
        certification.setIssuingOrganization(request.getIssuingOrganization());
        certification.setIssueDate(request.getIssueDate());
        certification.setExpiryDate(request.getExpiryDate());
        certification.setCredentialId(request.getCredentialId());
        certification.setCredentialUrl(request.getCredentialUrl());
        certification.setDoesNotExpire(request.getDoesNotExpire());
        certification.setDisplayOrder(request.getDisplayOrder());
        certification.setProfile(profile);
        return certification;
    }

    public CertificationResponse toResponse(Certification certification) {
        CertificationResponse response = new CertificationResponse();
        response.setId(certification.getId());
        response.setName(certification.getName());
        response.setIssuingOrganization(certification.getIssuingOrganization());
        response.setIssueDate(certification.getIssueDate());
        response.setExpiryDate(certification.getExpiryDate());
        response.setCredentialId(certification.getCredentialId());
        response.setCredentialUrl(certification.getCredentialUrl());
        response.setDoesNotExpire(certification.isDoesNotExpire());
        response.setDisplayOrder(certification.getDisplayOrder());
        response.setCreatedAt(certification.getCreatedAt());
        response.setUpdatedAt(certification.getUpdatedAt());
        return response;
    }

    public void updateEntity(Certification certification, UpdateCertificationRequest request) {
        certification.setName(request.getName());
        certification.setIssuingOrganization(request.getIssuingOrganization());
        certification.setIssueDate(request.getIssueDate());
        certification.setExpiryDate(request.getExpiryDate());
        certification.setCredentialId(request.getCredentialId());
        certification.setCredentialUrl(request.getCredentialUrl());
        certification.setDoesNotExpire(request.getDoesNotExpire());
        certification.setDisplayOrder(request.getDisplayOrder());
    }
}
