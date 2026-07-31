package com.professionalidentity.backend.dto.request;

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
public class UpdateCertificationRequest {

    @NotBlank
    @Size(max = 200)
    private String name;

    @NotBlank
    @Size(max = 200)
    private String issuingOrganization;

    @NotNull
    private LocalDate issueDate;

    private LocalDate expiryDate;

    @Size(max = 200)
    private String credentialId;

    @URL
    @Size(max = 500)
    private String credentialUrl;

    @NotNull
    private Boolean doesNotExpire;

    @PositiveOrZero
    private Integer displayOrder;
}
