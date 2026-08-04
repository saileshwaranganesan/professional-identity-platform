package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateProjectRequest;
import com.professionalidentity.backend.dto.request.UpdateProjectRequest;
import com.professionalidentity.backend.dto.response.ProjectResponse;
import com.professionalidentity.backend.dto.response.ProjectSummaryResponse;
import com.professionalidentity.backend.dto.response.ProjectBlockDto;
import com.professionalidentity.backend.entity.Project;
import com.professionalidentity.backend.entity.ProjectBlock;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

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
        if (request.getHighlights() != null) {
            entity.getHighlights().clear();
            entity.getHighlights().addAll(request.getHighlights());
        }
        
        entity.setRole(request.getRole());
        entity.setDuration(request.getDuration());
        entity.setTeamSize(request.getTeamSize());

        entity.getBlocks().clear();
        if (request.getBlocks() != null) {
            for (ProjectBlockDto dto : request.getBlocks()) {
                ProjectBlock block = new ProjectBlock();
                block.setBlockType(dto.getBlockType());
                block.setDisplayOrder(dto.getDisplayOrder());
                block.setPayload(dto.getPayload());
                block.setProject(entity);
                entity.getBlocks().add(block);
            }
        }
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
        if (request.getHighlights() != null) {
            entity.getHighlights().clear();
            entity.getHighlights().addAll(request.getHighlights());
        }
        
        entity.setRole(request.getRole());
        entity.setDuration(request.getDuration());
        entity.setTeamSize(request.getTeamSize());

        entity.getBlocks().clear();
        if (request.getBlocks() != null) {
            for (ProjectBlockDto dto : request.getBlocks()) {
                ProjectBlock block = new ProjectBlock();
                block.setBlockType(dto.getBlockType());
                block.setDisplayOrder(dto.getDisplayOrder());
                block.setPayload(dto.getPayload());
                block.setProject(entity);
                entity.getBlocks().add(block);
            }
        }
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
        response.setRole(entity.getRole());
        response.setDuration(entity.getDuration());
        response.setTeamSize(entity.getTeamSize());
        response.setHighlights(entity.getHighlights());
        
        if (entity.getBlocks() != null) {
            response.setBlocks(entity.getBlocks().stream().map(block -> {
                ProjectBlockDto dto = new ProjectBlockDto();
                dto.setId(block.getId());
                dto.setBlockType(block.getBlockType());
                dto.setDisplayOrder(block.getDisplayOrder());
                dto.setPayload(block.getPayload());
                return dto;
            }).collect(Collectors.toList()));
        }

        return response;
    }

    public List<ProjectResponse> toResponseList(List<Project> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectSummaryResponse toSummaryResponse(Project entity) {
        ProjectSummaryResponse response = new ProjectSummaryResponse();
        response.setTitle(entity.getTitle());
        response.setSlug(entity.getSlug());
        response.setHeadline(entity.getHeadline());
        response.setShortDescription(entity.getShortDescription());
        response.setFeatured(entity.isFeatured());
        response.setStatus(entity.getStatus());
        response.setHighlights(entity.getHighlights());
        return response;
    }

    public List<ProjectSummaryResponse> toSummaryResponseList(List<Project> entities) {
        return entities.stream()
                .map(this::toSummaryResponse)
                .toList();
    }
}
