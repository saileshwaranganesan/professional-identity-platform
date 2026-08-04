package com.professionalidentity.backend.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PortfolioResponse {

    private ProfileResponse profile;
    private List<ProjectSummaryResponse> projects;
    private List<ExperienceResponse> experiences;
    private List<EducationResponse> educations;
    private List<SkillResponse> skills;
    private List<CertificationResponse> certifications;
    private List<AchievementResponse> achievements;
    private List<SocialLinkResponse> socialLinks;
    private ProfileCompletionResponse completion;
}
