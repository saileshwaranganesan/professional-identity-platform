package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.response.PortfolioResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.exception.ProfileNotFoundException;
import com.professionalidentity.backend.mapper.PortfolioMapper;
import com.professionalidentity.backend.repository.AchievementRepository;
import com.professionalidentity.backend.repository.CertificationRepository;
import com.professionalidentity.backend.repository.EducationRepository;
import com.professionalidentity.backend.repository.ExperienceRepository;
import com.professionalidentity.backend.repository.ProfileRepository;
import com.professionalidentity.backend.repository.ProjectRepository;
import com.professionalidentity.backend.repository.SkillRepository;
import com.professionalidentity.backend.repository.SocialLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PortfolioService {

    private final ProfileRepository profileRepository;
    private final CurrentUserService currentUserService;
    private final ProjectRepository projectRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;
    private final CertificationRepository certificationRepository;
    private final AchievementRepository achievementRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final ProfileCompletionService profileCompletionService;
    private final PortfolioMapper portfolioMapper;

    public PortfolioService(
            ProfileRepository profileRepository,
            CurrentUserService currentUserService,
            ProjectRepository projectRepository,
            ExperienceRepository experienceRepository,
            EducationRepository educationRepository,
            SkillRepository skillRepository,
            CertificationRepository certificationRepository,
            AchievementRepository achievementRepository,
            SocialLinkRepository socialLinkRepository,
            ProfileCompletionService profileCompletionService,
            PortfolioMapper portfolioMapper
    ) {
        this.profileRepository = profileRepository;
        this.currentUserService = currentUserService;
        this.projectRepository = projectRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
        this.achievementRepository = achievementRepository;
        this.socialLinkRepository = socialLinkRepository;
        this.profileCompletionService = profileCompletionService;
        this.portfolioMapper = portfolioMapper;
    }

    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolio() {
        return getPortfolio(currentUserService.getCurrentProfile(), false);
    }

    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolioByUsername(String username) {
        Profile profile = profileRepository.findByUsername(username)
                .orElseThrow(() -> new ProfileNotFoundException(username));
        return getPortfolio(profile, true);
    }

    private PortfolioResponse getPortfolio(Profile profile, boolean publicPortfolio) {
        UUID profileId = profile.getId();
        return portfolioMapper.toResponse(
                profile,
                publicPortfolio
                        ? projectRepository.findByProfileIdAndPublishedTrue(profileId)
                        : projectRepository.findByProfileId(profileId),
                experienceRepository.findByProfileIdOrderByDisplayOrderAsc(profileId),
                educationRepository.findByProfileId(profileId),
                skillRepository.findByProfileId(profileId),
                certificationRepository.findByProfileId(profileId),
                achievementRepository.findByProfileIdOrderByDisplayOrderAsc(profileId),
                socialLinkRepository.findByProfileId(profileId),
                profileCompletionService.calculateCompletion(profile)
        );
    }

}
