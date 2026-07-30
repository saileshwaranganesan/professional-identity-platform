package com.professionalidentity.backend.dto.response;

import com.professionalidentity.backend.entity.enums.EmploymentStatus;
import com.professionalidentity.backend.entity.enums.EmploymentType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ExperienceResponse {

    private UUID id;
    private String company;
    private String position;
    private EmploymentType employmentType;
    private EmploymentStatus employmentStatus;
    private String location;
    private String description;
    private String technologies;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean currentlyWorking;
    private String companyWebsite;
    private String companyLogo;
    private int displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
