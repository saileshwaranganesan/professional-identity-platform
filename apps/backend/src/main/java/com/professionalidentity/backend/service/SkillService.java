package com.professionalidentity.backend.service;

import com.professionalidentity.backend.dto.request.CreateSkillRequest;
import com.professionalidentity.backend.dto.request.UpdateSkillRequest;
import com.professionalidentity.backend.dto.response.SkillResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.Skill;
import com.professionalidentity.backend.exception.SkillNotFoundException;
import com.professionalidentity.backend.mapper.SkillMapper;
import com.professionalidentity.backend.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final CurrentUserService currentUserService;
    private final SkillMapper skillMapper;

    public SkillService(
            SkillRepository skillRepository,
            CurrentUserService currentUserService,
            SkillMapper skillMapper
    ) {
        this.skillRepository = skillRepository;
        this.currentUserService = currentUserService;
        this.skillMapper = skillMapper;
    }

    @Transactional
    public SkillResponse createSkill(CreateSkillRequest request) {
        Profile profile = currentUserService.getCurrentProfile();
        Skill skill = skillMapper.toEntity(request, profile);
        return save(skill);
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> getSkills() {
        return skillRepository.findByProfileId(currentUserService.getCurrentProfile().getId()).stream()
                .map(skillMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SkillResponse getSkill(UUID skillId) {
        return skillMapper.toResponse(getSkillOrThrow(currentUserService.getCurrentProfile().getId(), skillId));
    }

    @Transactional
    public SkillResponse updateSkill(UUID skillId, UpdateSkillRequest request) {
        Skill skill = getSkillOrThrow(currentUserService.getCurrentProfile().getId(), skillId);
        skillMapper.updateEntity(skill, request);
        return save(skill);
    }

    @Transactional
    public void deleteSkill(UUID skillId) {
        skillRepository.delete(getSkillOrThrow(currentUserService.getCurrentProfile().getId(), skillId));
    }

    private Skill getSkillOrThrow(UUID profileId, UUID skillId) {
        return skillRepository.findByIdAndProfileId(skillId, profileId)
                .orElseThrow(() -> new SkillNotFoundException(skillId));
    }

    private SkillResponse save(Skill skill) {
        return skillMapper.toResponse(skillRepository.save(skill));
    }
}
