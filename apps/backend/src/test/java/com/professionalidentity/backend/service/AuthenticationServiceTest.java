package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.LoginRequest;
import com.professionalidentity.backend.dto.response.UserResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.entity.enums.Role;
import com.professionalidentity.backend.security.CustomUserDetails;
import com.professionalidentity.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private com.professionalidentity.backend.repository.UserRepository userRepository;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User testUser;
    private CustomUserDetails customUserDetails;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("admin@professionalidentity.local");
        testUser.setPassword("encoded_password");
        testUser.setRole(Role.ADMIN);
        testUser.setEnabled(true);

        Profile profile = new Profile();
        profile.setId(UUID.randomUUID());
        profile.setUser(testUser);
        profile.setUsername("admin");
        profile.setFirstName("System");
        profile.setLastName("Admin");
        testUser.setProfile(profile);

        customUserDetails = new CustomUserDetails(testUser);
    }

    @Test
    @DisplayName("authenticate — returns CustomUserDetails when valid credentials provided")
    void authenticate_ValidCredentials_ReturnsCustomUserDetails() {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@professionalidentity.local");
        request.setPassword("Admin@123");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(customUserDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        CustomUserDetails result = authenticationService.authenticate(request);

        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getUsername());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("authenticate — throws BadCredentialsException on invalid password")
    void authenticate_InvalidCredentials_ThrowsBadCredentialsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@professionalidentity.local");
        request.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authenticationService.authenticate(request));
    }

    @Test
    @DisplayName("generateToken — delegates token generation to JwtService")
    void generateToken_DelegatesToJwtService() {
        when(jwtService.generateToken(customUserDetails)).thenReturn("mock.jwt.token");

        String token = authenticationService.generateToken(customUserDetails);

        assertEquals("mock.jwt.token", token);
        verify(jwtService).generateToken(customUserDetails);
    }

    @Test
    @DisplayName("toUserResponse — correctly maps User domain entity to UserResponse DTO")
    void toUserResponse_MapsUserToUserResponse() {
        UserResponse response = authenticationService.toUserResponse(testUser);

        assertNotNull(response);
        assertEquals(testUser.getId(), response.getId());
        assertEquals(testUser.getEmail(), response.getEmail());
        assertEquals("ADMIN", response.getRole());
        assertEquals("admin", response.getUsername());
        assertEquals("System", response.getFirstName());
        assertEquals("Admin", response.getLastName());
    }
}
