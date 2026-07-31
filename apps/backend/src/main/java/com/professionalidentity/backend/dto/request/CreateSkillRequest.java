package com.professionalidentity.backend.dto.request;

import com.professionalidentity.backend.entity.enums.SkillLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateSkillRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotNull
    private SkillLevel level;

    @Size(max = 100)
    private String category;

    @PositiveOrZero
    private Integer displayOrder;
}
