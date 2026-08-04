package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.response.PortfolioResponse;
import com.professionalidentity.backend.dto.response.ProfileCompletionResponse;
import com.professionalidentity.backend.entity.Achievement;
import com.professionalidentity.backend.entity.Certification;
import com.professionalidentity.backend.entity.Education;
import com.professionalidentity.backend.entity.Experience;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.Project;
import com.professionalidentity.backend.entity.Skill;
import com.professionalidentity.backend.entity.SocialLink;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PortfolioMapper {

    private final ProfileMapper profileMapper;
    private final ProjectMapper projectMapper;
    private final ExperienceMapper experienceMapper;
    private final EducationMapper educationMapper;
    private final SkillMapper skillMapper;
    private final CertificationMapper certificationMapper;
    private final AchievementMapper achievementMapper;
    private final SocialLinkMapper socialLinkMapper;

    public PortfolioMapper(
            ProfileMapper profileMapper,
            ProjectMapper projectMapper,
            ExperienceMapper experienceMapper,
            EducationMapper educationMapper,
            SkillMapper skillMapper,
            CertificationMapper certificationMapper,
            AchievementMapper achievementMapper,
            SocialLinkMapper socialLinkMapper
    ) {
        this.profileMapper = profileMapper;
        this.projectMapper = projectMapper;
        this.experienceMapper = experienceMapper;
        this.educationMapper = educationMapper;
        this.skillMapper = skillMapper;
        this.certificationMapper = certificationMapper;
        this.achievementMapper = achievementMapper;
        this.socialLinkMapper = socialLinkMapper;
    }

    public PortfolioResponse toResponse(
            Profile profile,
            List<Project> projects,
            List<Experience> experiences,
            List<Education> educations,
            List<Skill> skills,
            List<Certification> certifications,
            List<Achievement> achievements,
            List<SocialLink> socialLinks,
            ProfileCompletionResponse completion
    ) {
        PortfolioResponse response = new PortfolioResponse();
        response.setProfile(profileMapper.toResponse(profile));
        response.setProjects(projectMapper.toSummaryResponseList(projects));
        response.setExperiences(experienceMapper.toResponseList(experiences));
        response.setEducations(educations.stream().map(educationMapper::toResponse).toList());
        response.setSkills(skills.stream().map(skillMapper::toResponse).toList());
        response.setCertifications(certifications.stream().map(certificationMapper::toResponse).toList());
        response.setAchievements(achievements.stream().map(achievementMapper::toResponse).toList());
        response.setSocialLinks(socialLinks.stream().map(socialLinkMapper::toResponse).toList());
        response.setCompletion(completion);
        return response;
    }
}
