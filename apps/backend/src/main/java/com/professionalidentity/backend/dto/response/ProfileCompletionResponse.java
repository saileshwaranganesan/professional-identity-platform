package com.professionalidentity.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProfileCompletionResponse {

    private int completionPercentage;
    private List<String> completedSections;
    private List<String> missingSections;
    private int completedScore;
    private int totalScore;
    private List<SectionCompletion> sectionBreakdown;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionCompletion {

        private String section;
        private String status;
        private int score;
    }
}
