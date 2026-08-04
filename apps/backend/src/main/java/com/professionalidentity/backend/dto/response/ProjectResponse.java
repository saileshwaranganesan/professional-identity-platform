package com.professionalidentity.backend.dto.response;

import com.professionalidentity.backend.entity.enums.ProjectStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ProjectResponse {

    private UUID id;
    private String title;
    private String slug;
    private String headline;
    private String shortDescription;
    private String description;
    private String githubUrl;
    private String liveDemoUrl;
    private String documentationUrl;
    private boolean featured;
    private boolean published;
    private ProjectStatus status;
    private String impact;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String role;
    private String duration;
    private Integer teamSize;

    private List<ProjectBlockDto> blocks;
    private List<String> highlights;
}
