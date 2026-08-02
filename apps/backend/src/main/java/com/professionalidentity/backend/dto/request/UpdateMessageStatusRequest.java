package com.professionalidentity.backend.dto.request;

import com.professionalidentity.backend.entity.enums.MessageStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateMessageStatusRequest {

    @NotNull
    private MessageStatus status;
}