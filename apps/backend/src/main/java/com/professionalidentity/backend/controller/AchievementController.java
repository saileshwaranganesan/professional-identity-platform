package com.professionalidentity.backend.controller;

import com.professionalidentity.backend.constant.ApplicationConstants;
import com.professionalidentity.backend.dto.request.CreateAchievementRequest;
import com.professionalidentity.backend.dto.request.UpdateAchievementRequest;
import com.professionalidentity.backend.dto.response.AchievementResponse;
import com.professionalidentity.backend.service.AchievementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Achievements", description = "Manage achievements in the authenticated user's profile.")
@RequestMapping(ApplicationConstants.API_PREFIX + "/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @PostMapping
    public ResponseEntity<AchievementResponse> createAchievement(@Valid @RequestBody CreateAchievementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(achievementService.createAchievement(request));
    }

    @GetMapping
    public ResponseEntity<List<AchievementResponse>> getAchievements() {
        return ResponseEntity.ok(achievementService.getAchievements());
    }

    @GetMapping("/{achievementId}")
    public ResponseEntity<AchievementResponse> getAchievement(
            @PathVariable UUID achievementId
    ) {
        return ResponseEntity.ok(achievementService.getAchievement(achievementId));
    }

    @PutMapping("/{achievementId}")
    public ResponseEntity<AchievementResponse> updateAchievement(
            @PathVariable UUID achievementId,
            @Valid @RequestBody UpdateAchievementRequest request
    ) {
        return ResponseEntity.ok(achievementService.updateAchievement(achievementId, request));
    }

    @DeleteMapping("/{achievementId}")
    public ResponseEntity<Void> deleteAchievement(
            @PathVariable UUID achievementId
    ) {
        achievementService.deleteAchievement(achievementId);
        return ResponseEntity.noContent().build();
    }
}
