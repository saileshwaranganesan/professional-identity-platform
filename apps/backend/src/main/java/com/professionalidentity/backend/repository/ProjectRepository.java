package com.professionalidentity.backend.repository;

import com.professionalidentity.backend.entity.Project;
import com.professionalidentity.backend.entity.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Optional<Project> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Project> findByPublishedTrue();

    List<Project> findByFeaturedTrueAndPublishedTrue();

    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByProfileId(UUID profileId);

    boolean existsByProfileId(UUID profileId);

    List<Project> findByProfileIdAndPublishedTrue(UUID profileId);
}
