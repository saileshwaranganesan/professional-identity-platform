package com.professionalidentity.backend.dto.request;

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
public class UpdateEducationRequest {

    @NotBlank
    @Size(max = 200)
    private String institution;

    @NotBlank
    @Size(max = 200)
    private String degree;

    @Size(max = 200)
    private String fieldOfStudy;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @Size(max = 100)
    private String grade;

    @Size(max = 2000)
    private String description;

    @NotNull
    private Boolean currentlyStudying;
}
