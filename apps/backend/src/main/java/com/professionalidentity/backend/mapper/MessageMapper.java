package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateMessageRequest;
import com.professionalidentity.backend.dto.response.MessageResponse;
import com.professionalidentity.backend.entity.Message;
import com.professionalidentity.backend.entity.enums.MessageStatus;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {

    public Message toEntity(CreateMessageRequest request) {
        Message message = new Message();
        message.setSenderName(request.getSenderName());
        message.setSenderEmail(request.getSenderEmail());
        message.setSubject(request.getSubject());
        message.setContent(request.getContent());
        message.setStatus(MessageStatus.UNREAD);
        return message;
    }

    public MessageResponse toResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setSenderName(message.getSenderName());
        response.setSenderEmail(message.getSenderEmail());
        response.setSubject(message.getSubject());
        response.setContent(message.getContent());
        response.setStatus(message.getStatus());
        response.setCreatedAt(message.getCreatedAt());
        response.setUpdatedAt(message.getUpdatedAt());
        return response;
    }
}