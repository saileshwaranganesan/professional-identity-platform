package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.response.ProfileCompletionResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.repository.AchievementRepository;
import com.professionalidentity.backend.repository.CertificationRepository;
import com.professionalidentity.backend.repository.EducationRepository;
import com.professionalidentity.backend.repository.ExperienceRepository;
import com.professionalidentity.backend.repository.ProjectRepository;
import com.professionalidentity.backend.repository.SkillRepository;
import com.professionalidentity.backend.repository.SocialLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProfileCompletionService {

    private static final int TOTAL_SCORE = 100;
    private static final String COMPLETED = "Completed";
    private static final String MISSING = "Missing";

    private final CurrentUserService currentUserService;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;
    private final CertificationRepository certificationRepository;
    private final AchievementRepository achievementRepository;
    private final SocialLinkRepository socialLinkRepository;

    public ProfileCompletionService(
            CurrentUserService currentUserService,
            ProjectRepository projectRepository,
            ExperienceRepository experienceRepository,
            EducationRepository educationRepository,
            SkillRepository skillRepository,
            CertificationRepository certificationRepository,
            AchievementRepository achievementRepository,
            SocialLinkRepository socialLinkRepository
    ) {
        this.currentUserService = currentUserService;
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
        this.achievementRepository = achievementRepository;
        this.socialLinkRepository = socialLinkRepository;
    }

    @Transactional(readOnly = true)
    public ProfileCompletionResponse calculateCompletion() {
        return calculateCompletion(currentUserService.getCurrentProfile());
    }

    ProfileCompletionResponse calculateCompletion(Profile profile) {
        UUID profileId = profile.getId();

        List<String> completedSections = new ArrayList<>();
        List<String> missingSections = new ArrayList<>();
        List<ProfileCompletionResponse.SectionCompletion> sectionBreakdown = new ArrayList<>();

        int completedScore = 0;
        completedScore += addSection(
                "Profile", true, 15, completedSections, missingSections, sectionBreakdown
        );
        completedScore += addSection(
                "Projects", projectRepository.existsByProfileId(profileId), 20,
                completedSections, missingSections, sectionBreakdown
        );
        completedScore += addSection(
                "Experience", experienceRepository.existsByProfileId(profileId), 20,
                completedSections, missingSections, sectionBreakdown
        );
        completedScore += addSection(
                "Education", educationRepository.existsByProfileId(profileId), 15,
                completedSections, missingSections, sectionBreakdown
        );
        completedScore += addSection(
                "Skills", skillRepository.existsByProfileId(profileId), 10,
                completedSections, missingSections, sectionBreakdown
        );
        completedScore += addSection(
                "Certifications", certificationRepository.existsByProfileId(profileId), 10,
                completedSections, missingSections, sectionBreakdown
        );
        completedScore += addSection(
                "Achievements", achievementRepository.existsByProfileId(profileId), 5,
                completedSections, missingSections, sectionBreakdown
        );
        completedScore += addSection(
                "Social Links", socialLinkRepository.existsByProfileId(profileId), 5,
                completedSections, missingSections, sectionBreakdown
        );

        ProfileCompletionResponse response = new ProfileCompletionResponse();
        response.setCompletionPercentage(completedScore * 100 / TOTAL_SCORE);
        response.setCompletedSections(completedSections);
        response.setMissingSections(missingSections);
        response.setCompletedScore(completedScore);
        response.setTotalScore(TOTAL_SCORE);
        response.setSectionBreakdown(sectionBreakdown);
        return response;
    }

    private int addSection(
            String section,
            boolean completed,
            int sectionScore,
            List<String> completedSections,
            List<String> missingSections,
            List<ProfileCompletionResponse.SectionCompletion> sectionBreakdown
    ) {
        int awardedScore = completed ? sectionScore : 0;
        if (completed) {
            completedSections.add(section);
        } else {
            missingSections.add(section);
        }
        sectionBreakdown.add(new ProfileCompletionResponse.SectionCompletion(
                section,
                completed ? COMPLETED : MISSING,
                awardedScore
        ));
        return awardedScore;
    }
}
