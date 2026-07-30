package com.professionalidentity.backend.entity;

import com.professionalidentity.backend.entity.audit.BaseEntity;
import com.professionalidentity.backend.entity.enums.ProjectStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(
        name = "projects",
        indexes = {
                @Index(name = "idx_projects_slug", columnList = "slug"),
                @Index(name = "idx_projects_featured", columnList = "featured"),
                @Index(name = "idx_projects_published", columnList = "published"),
                @Index(name = "idx_projects_status", columnList = "status")
        }
)
@NoArgsConstructor
public class Project extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "slug", nullable = false, unique = true, length = 200)
    private String slug;

    @Column(name = "headline", length = 250)
    private String headline;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "live_demo_url", length = 500)
    private String liveDemoUrl;

    @Column(name = "documentation_url", length = 500)
    private String documentationUrl;

    @Column(name = "featured", nullable = false)
    private boolean featured;

    @Column(name = "published", nullable = false)
    private boolean published;

    @Column(name = "impact", columnDefinition = "TEXT")
    private String impact;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ProjectStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;
}
