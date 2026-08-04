package com.professionalidentity.backend;

import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.repository.UserRepository;
import com.professionalidentity.backend.security.CustomUserDetails;
import com.professionalidentity.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    void protectedEndpointReturnsConsistentJsonForUnauthenticatedRequests() throws Exception {
        mockMvc.perform(get("/api/v1/portfolio"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Authentication is required."));
    }

    @Test
    void disabledUserTokenCannotAccessProtectedEndpoint() throws Exception {
        User user = userRepository.findByEmail("admin@test.local").orElseThrow();
        boolean originallyEnabled = user.isEnabled();
        user.setEnabled(false);
        userRepository.saveAndFlush(user);

        try {
            String token = jwtService.generateToken(new CustomUserDetails(user));

            mockMvc.perform(get("/api/v1/portfolio").header("Authorization", "Bearer " + token))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Authentication is required."));
        } finally {
            user.setEnabled(originallyEnabled);
            userRepository.saveAndFlush(user);
        }
    }

    @Test
    void apiDocumentationEndpointIsPublicAndAvailable() throws Exception {
        mockMvc.perform(get("/api-docs"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.openapi").exists());
    }

    @Test
    void unknownRouteReturnsNotFound() throws Exception {
        mockMvc.perform(get("/swagger-ui/missing.js"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Resource not found."));
    }

    @Test
    void missingRequiredRequestParameterReturnsBadRequest() throws Exception {
        User user = userRepository.findByEmail("admin@test.local").orElseThrow();
        String token = jwtService.generateToken(new CustomUserDetails(user));

        mockMvc.perform(patch("/api/v1/projects/{projectId}/publish", UUID.randomUUID())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("The request contains invalid input."));
    }

    @Test
    void logoutEndpointReturnsCleanJwtCookieWithMaxAgeZero() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/v1/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header().string(
                        org.springframework.http.HttpHeaders.SET_COOKIE,
                        org.hamcrest.Matchers.containsString("jwt=; Path=/; Max-Age=0")
                ));
    }
}

