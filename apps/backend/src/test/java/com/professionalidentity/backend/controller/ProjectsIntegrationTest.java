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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("GET /api/v1/public/{username} — returns public portfolio data")
    void getPublicProjects_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/v1/public/admin"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("POST /api/v1/projects — unauthenticated user receives 401 Unauthorized")
    void createProject_Unauthenticated_ReturnsUnauthorized() throws Exception {
        String payload = """
                {
                    "title": "New Portfolio Project",
                    "slug": "new-portfolio-project",
                    "shortDescription": "Summary of portfolio project",
                    "published": true,
                    "featured": false,
                    "status": "COMPLETED"
                }
                """;

        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("POST /api/v1/projects — authenticated admin can create project")
    void createProject_AuthenticatedAdmin_ReturnsCreated() throws Exception {
        User admin = userRepository.findByEmail("admin@test.local").orElseThrow();
        String token = jwtService.generateToken(new CustomUserDetails(admin));

        String payload = """
                {
                    "title": "Automated Test Project",
                    "slug": "automated-test-project",
                    "headline": "Full-stack project for automated testing",
                    "shortDescription": "Comprehensive summary of automated test project.",
                    "description": "Long form detailed description of project.",
                    "published": true,
                    "featured": true,
                    "status": "COMPLETED"
                }
                """;

        mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Automated Test Project"))
                .andExpect(jsonPath("$.slug").value("automated-test-project"));
    }
}
