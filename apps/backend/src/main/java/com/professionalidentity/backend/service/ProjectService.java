package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.CreateProjectRequest;
import com.professionalidentity.backend.dto.request.UpdateProjectRequest;
import com.professionalidentity.backend.dto.response.ProjectResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.Project;
import com.professionalidentity.backend.exception.DuplicateProjectSlugException;
import com.professionalidentity.backend.exception.ProfileNotFoundException;
import com.professionalidentity.backend.exception.ProjectNotFoundException;
import com.professionalidentity.backend.mapper.ProjectMapper;
import com.professionalidentity.backend.repository.ProfileRepository;
import com.professionalidentity.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProfileRepository profileRepository;
    private final ProjectMapper projectMapper;

    public ProjectService(
            ProjectRepository projectRepository,
            ProfileRepository profileRepository,
            ProjectMapper projectMapper
    ) {
        this.projectRepository = projectRepository;
        this.profileRepository = profileRepository;
        this.projectMapper = projectMapper;
    }

    @Transactional
    public ProjectResponse createProject(UUID profileId, CreateProjectRequest request) {
        Profile profile = getProfileOrThrow(profileId);
        validateUniqueSlug(request.getSlug());

        Project project = new Project();
        project.setProfile(profile);
        projectMapper.populateEntity(project, request);
        project.setFeatured(false);
        project.setPublished(false);

        return save(project);
    }

    @Transactional
    public ProjectResponse updateProject(UUID projectId, UpdateProjectRequest request) {
        Project project = getProjectOrThrow(projectId);
        if (!project.getSlug().equals(request.getSlug())) {
            validateUniqueSlug(request.getSlug());
        }

        projectMapper.updateEntity(project, request);
        return save(project);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectBySlug(String slug) {
        return projectRepository.findBySlug(slug)
                .filter(Project::isPublished)
                .map(projectMapper::toResponse)
                .orElseThrow(() -> new ProjectNotFoundException(slug));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getPublishedProjects() {
        return projectMapper.toResponseList(projectRepository.findByPublishedTrue());
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getFeaturedProjects() {
        return projectMapper.toResponseList(projectRepository.findByFeaturedTrueAndPublishedTrue());
    }

    @Transactional
    public ProjectResponse changePublicationStatus(UUID projectId, boolean published) {
        Project project = getProjectOrThrow(projectId);
        project.setPublished(published);
        return save(project);
    }

    @Transactional
    public ProjectResponse changeFeaturedStatus(UUID projectId, boolean featured) {
        Project project = getProjectOrThrow(projectId);
        project.setFeatured(featured);
        return save(project);
    }

    @Transactional
    public void deleteProject(UUID projectId) {
        projectRepository.delete(getProjectOrThrow(projectId));
    }

    private Project getProjectOrThrow(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
    }

    private Profile getProfileOrThrow(UUID profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> new ProfileNotFoundException(profileId));
    }

    private void validateUniqueSlug(String slug) {
        if (projectRepository.existsBySlug(slug)) {
            throw new DuplicateProjectSlugException(slug);
        }
    }

    private ProjectResponse save(Project project) {
        return projectMapper.toResponse(projectRepository.save(project));
    }
}
