package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateEducationRequest;
import com.professionalidentity.backend.dto.request.UpdateEducationRequest;
import com.professionalidentity.backend.dto.response.EducationResponse;
import com.professionalidentity.backend.entity.Education;
import com.professionalidentity.backend.entity.Profile;
import org.springframework.stereotype.Component;

@Component
public class EducationMapper {

    public Education toEntity(CreateEducationRequest request, Profile profile) {
        Education education = new Education();
        education.setInstitution(request.getInstitution());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setStartDate(request.getStartDate());
        education.setEndDate(request.getEndDate());
        education.setGrade(request.getGrade());
        education.setDescription(request.getDescription());
        education.setCurrentlyStudying(request.getCurrentlyStudying());
        education.setProfile(profile);
        return education;
    }

    public EducationResponse toResponse(Education education) {
        EducationResponse response = new EducationResponse();
        response.setId(education.getId());
        response.setInstitution(education.getInstitution());
        response.setDegree(education.getDegree());
        response.setFieldOfStudy(education.getFieldOfStudy());
        response.setStartDate(education.getStartDate());
        response.setEndDate(education.getEndDate());
        response.setGrade(education.getGrade());
        response.setDescription(education.getDescription());
        response.setCurrentlyStudying(education.getCurrentlyStudying());
        response.setCreatedAt(education.getCreatedAt());
        response.setUpdatedAt(education.getUpdatedAt());
        return response;
    }

    public void updateEntity(Education education, UpdateEducationRequest request) {
        education.setInstitution(request.getInstitution());
        education.setDegree(request.getDegree());
        education.setFieldOfStudy(request.getFieldOfStudy());
        education.setStartDate(request.getStartDate());
        education.setEndDate(request.getEndDate());
        education.setGrade(request.getGrade());
        education.setDescription(request.getDescription());
        education.setCurrentlyStudying(request.getCurrentlyStudying());
    }
}
