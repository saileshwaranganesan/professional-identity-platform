package com.professionalidentity.backend.dto.response;

import com.professionalidentity.backend.entity.enums.ProjectStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProjectSummaryResponse {

    private String title;
    private String slug;
    private String headline;
    private String shortDescription;
    private boolean featured;
    private ProjectStatus status;
    private List<String> highlights;
}
