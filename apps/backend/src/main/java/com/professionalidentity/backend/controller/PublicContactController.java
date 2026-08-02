package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.request.CreateMessageRequest;
import com.professionalidentity.backend.dto.response.MessageResponse;
import com.professionalidentity.backend.service.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Public Contact", description = "Public endpoints for visitor contact form submission.")
@RequestMapping(ApplicationConstants.API_PREFIX + "/contact")
public class PublicContactController {

    private final MessageService messageService;

    public PublicContactController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<MessageResponse> submitContactMessage(@Valid @RequestBody CreateMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.createMessage(request));
    }
}