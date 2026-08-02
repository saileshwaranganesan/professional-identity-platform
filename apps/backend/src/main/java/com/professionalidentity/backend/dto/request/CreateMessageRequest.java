package com.professionalidentity.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateMessageRequest {

    @NotBlank
    @Size(max = 100)
    private String senderName;

    @NotBlank
    @Email
    @Size(max = 255)
    private String senderEmail;

    @NotBlank
    @Size(max = 200)
    private String subject;

    @NotBlank
    @Size(max = 5000)
    private String content;
}