package com.professionalidentity.backend.dto.response;

import com.professionalidentity.backend.entity.enums.SkillLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class SkillResponse {

    private UUID id;
    private String name;
    private SkillLevel level;
    private String category;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
