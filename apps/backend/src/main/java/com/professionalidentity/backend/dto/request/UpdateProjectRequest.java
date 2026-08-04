package com.professionalidentity.backend.dto.request;

import com.professionalidentity.backend.entity.enums.ProjectStatus;
import com.professionalidentity.backend.dto.response.ProjectBlockDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;
import java.util.List;

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

    @URL
    @Size(max = 500)
    private String githubUrl;

    @URL
    @Size(max = 500)
    private String liveDemoUrl;

    @URL
    @Size(max = 500)
    private String documentationUrl;

    private boolean featured;

    private boolean published;

    private String impact;

    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull
    private ProjectStatus status;

    private String role;
    private String duration;
    private Integer teamSize;

    private List<ProjectBlockDto> blocks;
    private List<String> highlights;
}
