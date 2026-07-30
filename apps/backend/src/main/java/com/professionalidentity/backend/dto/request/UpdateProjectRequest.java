package com.professionalidentity.backend.dto.request;

import com.professionalidentity.backend.entity.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProjectRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 200)
    private String slug;

    @Size(max = 250)
    private String headline;

    @Size(max = 500)
    private String shortDescription;

    private String description;

    @Size(max = 500)
    private String githubUrl;

    @Size(max = 500)
    private String liveDemoUrl;

    @Size(max = 500)
    private String documentationUrl;

    private boolean featured;

    private boolean published;

    private String impact;

    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull
    private ProjectStatus status;
}
