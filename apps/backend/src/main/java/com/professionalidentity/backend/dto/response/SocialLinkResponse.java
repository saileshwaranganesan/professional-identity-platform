package com.professionalidentity.backend.dto.response;

import com.professionalidentity.backend.entity.enums.SocialPlatform;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class SocialLinkResponse {

    private UUID id;
    private SocialPlatform platform;
    private String url;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
