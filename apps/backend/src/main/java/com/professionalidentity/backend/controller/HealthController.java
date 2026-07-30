package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping(ApplicationConstants.API_PREFIX)
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Backend is running")
                .data("UP")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
