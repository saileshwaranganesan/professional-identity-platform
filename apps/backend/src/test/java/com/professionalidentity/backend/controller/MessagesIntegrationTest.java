package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.repository.UserRepository;
import com.professionalidentity.backend.security.CustomUserDetails;
import com.professionalidentity.backend.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MessagesIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("POST /api/v1/contact — visitor can submit contact message")
    void submitContactMessage_ValidPayload_ReturnsCreated() throws Exception {
        String payload = """
                {
                    "senderName": "Jane Visitor",
                    "senderEmail": "jane.visitor@example.com",
                    "subject": "Inquiry Regarding Architecture Consulting",
                    "content": "Hello, I am interested in discussing architecture consulting options."
                }
                """;

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.senderName").value("Jane Visitor"))
                .andExpect(jsonPath("$.status").value("UNREAD"));
    }

    @Test
    @DisplayName("POST /api/v1/contact — invalid email payload returns 400 Bad Request")
    void submitContactMessage_InvalidEmail_ReturnsBadRequest() throws Exception {
        String payload = """
                {
                    "senderName": "Jane Visitor",
                    "senderEmail": "invalid-email-format",
                    "subject": "Inquiry",
                    "content": "Short message content."
                }
                """;

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("GET /api/v1/messages — authenticated admin can fetch inbox messages")
    void getMessages_AuthenticatedAdmin_ReturnsOk() throws Exception {
        User admin = userRepository.findByEmail("admin@test.local").orElseThrow();
        String token = jwtService.generateToken(new CustomUserDetails(admin));

        mockMvc.perform(get("/api/v1/messages")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
