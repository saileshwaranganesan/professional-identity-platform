package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.Constants;
import com.professionalidentity.backend.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping(Constants.API_PREFIX)
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.<String>builder()
                .success(true)
                .message("Backend is running")
                .data("UP")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
