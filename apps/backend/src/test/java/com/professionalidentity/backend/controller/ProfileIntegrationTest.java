package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.repository.UserRepository;
import com.professionalidentity.backend.security.CustomUserDetails;
import com.professionalidentity.backend.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProfileIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("GET /api/v1/profile — unauthenticated user receives 401 Unauthorized")
    void getProfile_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/v1/profile — authenticated admin retrieves profile")
    void getProfile_Authenticated_ReturnsProfile() throws Exception {
        User admin = userRepository.findByEmail("admin@test.local").orElseThrow();
        String token = jwtService.generateToken(new CustomUserDetails(admin));

        mockMvc.perform(get("/api/v1/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    @DisplayName("PUT /api/v1/profile — authenticated admin updates profile")
    void updateProfile_Authenticated_UpdatesProfile() throws Exception {
        User admin = userRepository.findByEmail("admin@test.local").orElseThrow();
        String token = jwtService.generateToken(new CustomUserDetails(admin));

        String payload = """
                {
                    "username": "admin",
                    "firstName": "UpdatedFirstName",
                    "lastName": "UpdatedLastName",
                    "headline": "Senior Software Architect",
                    "bio": "Updated professional bio."
                }
                """;

        mockMvc.perform(put("/api/v1/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("UpdatedFirstName"))
                .andExpect(jsonPath("$.headline").value("Senior Software Architect"));
    }
}
