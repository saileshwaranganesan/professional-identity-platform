package com.professionalidentity.backend.dto.request;

import com.professionalidentity.backend.entity.enums.SocialPlatform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
@NoArgsConstructor
public class UpdateSocialLinkRequest {

    @NotNull
    private SocialPlatform platform;

    @NotBlank
    @URL
    @Size(max = 500)
    private String url;

    @PositiveOrZero
    private Integer displayOrder;
}
