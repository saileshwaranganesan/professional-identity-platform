package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.request.UpdateMessageStatusRequest;
import com.professionalidentity.backend.dto.response.MessageResponse;
import com.professionalidentity.backend.service.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Messages", description = "Manage visitor contact messages in the admin portal.")
@RequestMapping(ApplicationConstants.API_PREFIX + "/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages() {
        return ResponseEntity.ok(messageService.getMessages());
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<MessageResponse> getMessage(@PathVariable UUID messageId) {
        return ResponseEntity.ok(messageService.getMessage(messageId));
    }

    @PatchMapping("/{messageId}/status")
    public ResponseEntity<MessageResponse> updateMessageStatus(
            @PathVariable UUID messageId,
            @Valid @RequestBody UpdateMessageStatusRequest request
    ) {
        return ResponseEntity.ok(messageService.updateMessageStatus(messageId, request));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }
}