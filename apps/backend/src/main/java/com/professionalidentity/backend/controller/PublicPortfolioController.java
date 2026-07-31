package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.response.PortfolioResponse;
import com.professionalidentity.backend.service.PortfolioService;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Public Portfolio", description = "Retrieve a published portfolio by username.")
@SecurityRequirements
@RequestMapping(ApplicationConstants.API_PREFIX + "/public")
public class PublicPortfolioController {

    private final PortfolioService portfolioService;

    public PublicPortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<PortfolioResponse> getPortfolioByUsername(@PathVariable String username) {
        return ResponseEntity.ok(portfolioService.getPortfolioByUsername(username));
    }
}
