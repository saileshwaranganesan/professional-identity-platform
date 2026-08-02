package com.professionalidentity.backend.dto.response;

import com.professionalidentity.backend.entity.enums.MessageStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class MessageResponse {

    private UUID id;
    private String senderName;
    private String senderEmail;
    private String subject;
    private String content;
    private MessageStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}