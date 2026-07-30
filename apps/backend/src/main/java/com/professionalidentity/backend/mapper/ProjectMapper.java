package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateProjectRequest;
import com.professionalidentity.backend.dto.request.UpdateProjectRequest;
import com.professionalidentity.backend.dto.response.ProjectResponse;
import com.professionalidentity.backend.entity.Project;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProjectMapper {

    public void populateEntity(Project entity, CreateProjectRequest request) {
        entity.setTitle(request.getTitle());
        entity.setSlug(request.getSlug());
        entity.setHeadline(request.getHeadline());
        entity.setShortDescription(request.getShortDescription());
        entity.setDescription(request.getDescription());
        entity.setGithubUrl(request.getGithubUrl());
        entity.setLiveDemoUrl(request.getLiveDemoUrl());
        entity.setDocumentationUrl(request.getDocumentationUrl());
        entity.setFeatured(request.isFeatured());
        entity.setPublished(request.isPublished());
        entity.setImpact(request.getImpact());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setStatus(request.getStatus());
    }

    public void updateEntity(Project entity, UpdateProjectRequest request) {
        entity.setTitle(request.getTitle());
        entity.setSlug(request.getSlug());
        entity.setHeadline(request.getHeadline());
        entity.setShortDescription(request.getShortDescription());
        entity.setDescription(request.getDescription());
        entity.setGithubUrl(request.getGithubUrl());
        entity.setLiveDemoUrl(request.getLiveDemoUrl());
        entity.setDocumentationUrl(request.getDocumentationUrl());
        entity.setFeatured(request.isFeatured());
        entity.setPublished(request.isPublished());
        entity.setImpact(request.getImpact());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setStatus(request.getStatus());
    }

    public ProjectResponse toResponse(Project entity) {
        ProjectResponse response = new ProjectResponse();
        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setSlug(entity.getSlug());
        response.setHeadline(entity.getHeadline());
        response.setShortDescription(entity.getShortDescription());
        response.setDescription(entity.getDescription());
        response.setGithubUrl(entity.getGithubUrl());
        response.setLiveDemoUrl(entity.getLiveDemoUrl());
        response.setDocumentationUrl(entity.getDocumentationUrl());
        response.setFeatured(entity.isFeatured());
        response.setPublished(entity.isPublished());
        response.setStatus(entity.getStatus());
        response.setImpact(entity.getImpact());
        response.setStartDate(entity.getStartDate());
        response.setEndDate(entity.getEndDate());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }

    public List<ProjectResponse> toResponseList(List<Project> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }
}
