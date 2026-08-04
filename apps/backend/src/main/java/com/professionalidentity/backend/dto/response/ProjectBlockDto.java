package com.professionalidentity.backend.dto.response;

import com.fasterxml.jackson.databind.JsonNode;
import com.professionalidentity.backend.entity.enums.BlockType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ProjectBlockDto {
    private UUID id;
    private BlockType blockType;
    private int displayOrder;
    private JsonNode payload;
}
