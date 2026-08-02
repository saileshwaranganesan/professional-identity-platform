package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.CreateMessageRequest;
import com.professionalidentity.backend.dto.request.UpdateMessageStatusRequest;
import com.professionalidentity.backend.dto.response.MessageResponse;
import com.professionalidentity.backend.entity.Message;
import com.professionalidentity.backend.exception.MessageNotFoundException;
import com.professionalidentity.backend.mapper.MessageMapper;
import com.professionalidentity.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;

    public MessageService(MessageRepository messageRepository, MessageMapper messageMapper) {
        this.messageRepository = messageRepository;
        this.messageMapper = messageMapper;
    }

    @Transactional
    public MessageResponse createMessage(CreateMessageRequest request) {
        Message message = messageMapper.toEntity(request);
        return messageMapper.toResponse(messageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessages() {
        return messageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(messageMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MessageResponse getMessage(UUID messageId) {
        Message message = getMessageOrThrow(messageId);
        return messageMapper.toResponse(message);
    }

    @Transactional
    public MessageResponse updateMessageStatus(UUID messageId, UpdateMessageStatusRequest request) {
        Message message = getMessageOrThrow(messageId);
        message.setStatus(request.getStatus());
        return messageMapper.toResponse(messageRepository.save(message));
    }

    @Transactional
    public void deleteMessage(UUID messageId) {
        Message message = getMessageOrThrow(messageId);
        messageRepository.delete(message);
    }

    private Message getMessageOrThrow(UUID messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageNotFoundException(messageId));
    }
}