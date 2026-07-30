package com.professionalidentity.backend.dto.request;

import com.professionalidentity.backend.entity.enums.EmploymentStatus;
import com.professionalidentity.backend.entity.enums.EmploymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UpdateExperienceRequest {

    @NotBlank
    @Size(max = 200)
    private String company;

    @NotBlank
    @Size(max = 200)
    private String position;

    @NotNull
    private EmploymentType employmentType;

    @NotNull
    private EmploymentStatus employmentStatus;

    @Size(max = 255)
    private String location;

    @Size(max = 5000)
    private String description;

    @Size(max = 2000)
    private String technologies;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull
    private Boolean currentlyWorking;

    @URL
    @Size(max = 500)
    private String companyWebsite;

    @URL
    @Size(max = 500)
    private String companyLogo;

    @PositiveOrZero
    private Integer displayOrder;
}
