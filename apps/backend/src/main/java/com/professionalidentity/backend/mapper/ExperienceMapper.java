package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateExperienceRequest;
import com.professionalidentity.backend.dto.request.UpdateExperienceRequest;
import com.professionalidentity.backend.dto.response.ExperienceResponse;
import com.professionalidentity.backend.entity.Experience;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ExperienceMapper {

    public void populateEntity(Experience entity, CreateExperienceRequest request) {
        entity.setCompany(request.getCompany());
        entity.setPosition(request.getPosition());
        entity.setEmploymentType(request.getEmploymentType());
        entity.setEmploymentStatus(request.getEmploymentStatus());
        entity.setLocation(request.getLocation());
        entity.setDescription(request.getDescription());
        entity.setTechnologies(request.getTechnologies());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setCurrentlyWorking(request.getCurrentlyWorking());
        entity.setCompanyWebsite(request.getCompanyWebsite());
        entity.setCompanyLogo(request.getCompanyLogo());
    }

    public void updateEntity(Experience entity, UpdateExperienceRequest request) {
        entity.setCompany(request.getCompany());
        entity.setPosition(request.getPosition());
        entity.setEmploymentType(request.getEmploymentType());
        entity.setEmploymentStatus(request.getEmploymentStatus());
        entity.setLocation(request.getLocation());
        entity.setDescription(request.getDescription());
        entity.setTechnologies(request.getTechnologies());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setCurrentlyWorking(request.getCurrentlyWorking());
        entity.setCompanyWebsite(request.getCompanyWebsite());
        entity.setCompanyLogo(request.getCompanyLogo());
    }

    public ExperienceResponse toResponse(Experience entity) {
        ExperienceResponse response = new ExperienceResponse();
        response.setId(entity.getId());
        response.setCompany(entity.getCompany());
        response.setPosition(entity.getPosition());
        response.setEmploymentType(entity.getEmploymentType());
        response.setEmploymentStatus(entity.getEmploymentStatus());
        response.setLocation(entity.getLocation());
        response.setDescription(entity.getDescription());
        response.setTechnologies(entity.getTechnologies());
        response.setStartDate(entity.getStartDate());
        response.setEndDate(entity.getEndDate());
        response.setCurrentlyWorking(entity.isCurrentlyWorking());
        response.setCompanyWebsite(entity.getCompanyWebsite());
        response.setCompanyLogo(entity.getCompanyLogo());
        response.setDisplayOrder(entity.getDisplayOrder());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }

    public List<ExperienceResponse> toResponseList(List<Experience> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }
}
