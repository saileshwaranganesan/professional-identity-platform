package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.request.LoginRequest;
import com.professionalidentity.backend.dto.response.UserResponse;
import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.security.CustomUserDetails;
import com.professionalidentity.backend.security.JwtCookieUtil;
import com.professionalidentity.backend.service.AuthenticationService;
import com.professionalidentity.backend.service.CurrentUserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Authentication", description = "Authenticate with email and password using HttpOnly cookies.")
@SecurityRequirements
@RequestMapping(ApplicationConstants.API_PREFIX + "/auth")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final JwtCookieUtil jwtCookieUtil;
    private final CurrentUserService currentUserService;

    public AuthController(
            AuthenticationService authenticationService,
            JwtCookieUtil jwtCookieUtil,
            CurrentUserService currentUserService
    ) {
        this.authenticationService = authenticationService;
        this.jwtCookieUtil = jwtCookieUtil;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        CustomUserDetails userDetails = authenticationService.authenticate(request);
        String token = authenticationService.generateToken(userDetails);
        ResponseCookie cookie = jwtCookieUtil.createJwtCookie(token);

        UserResponse userResponse = authenticationService.toUserResponse(userDetails);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(userResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cleanCookie = jwtCookieUtil.createCleanJwtCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        try {
            User user = currentUserService.getCurrentUser();
            return ResponseEntity.ok(authenticationService.toUserResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}

