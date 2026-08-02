package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.LoginRequest;
import com.professionalidentity.backend.dto.response.AuthResponse;
import com.professionalidentity.backend.dto.response.UserResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.repository.UserRepository;
import com.professionalidentity.backend.security.CustomUserDetails;
import com.professionalidentity.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthenticationService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public CustomUserDetails authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        return (CustomUserDetails) authentication.getPrincipal();
    }

    public String generateToken(CustomUserDetails userDetails) {
        return jwtService.generateToken(userDetails);
    }

    public UserResponse toUserResponse(CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new IllegalStateException("User not found: " + userDetails.getUserId()));
        return toUserResponse(user);
    }

    public UserResponse toUserResponse(User user) {
        Profile profile = user.getProfile();
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .username(profile != null ? profile.getUsername() : null)
                .firstName(profile != null ? profile.getFirstName() : null)
                .lastName(profile != null ? profile.getLastName() : null)
                .build();
    }

    @Deprecated
    public AuthResponse login(LoginRequest request) {
        CustomUserDetails userDetails = authenticate(request);
        String accessToken = generateToken(userDetails);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMillis())
                .userId(userDetails.getUserId())
                .email(userDetails.getUsername())
                .role(userDetails.getRole().name())
                .build();
    }
}

