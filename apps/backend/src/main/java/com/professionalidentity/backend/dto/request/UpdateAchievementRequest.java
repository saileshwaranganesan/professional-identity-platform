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
public class UpdateAchievementRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 200)
    private String organization;

    @NotNull
    private LocalDate achievementDate;

    @Size(max = 2000)
    private String description;

    @URL
    @Size(max = 500)
    private String achievementUrl;

    @PositiveOrZero
    private Integer displayOrder;
}
