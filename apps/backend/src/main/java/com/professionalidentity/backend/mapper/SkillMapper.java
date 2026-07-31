package com.professionalidentity.backend.mapper;

import com.professionalidentity.backend.dto.request.CreateSkillRequest;
import com.professionalidentity.backend.dto.request.UpdateSkillRequest;
import com.professionalidentity.backend.dto.response.SkillResponse;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.Skill;
import org.springframework.stereotype.Component;

@Component
public class SkillMapper {

    public Skill toEntity(CreateSkillRequest request, Profile profile) {
        Skill skill = new Skill();
        skill.setName(request.getName());
        skill.setLevel(request.getLevel());
        skill.setCategory(request.getCategory());
        skill.setDisplayOrder(request.getDisplayOrder());
        skill.setProfile(profile);
        return skill;
    }

    public SkillResponse toResponse(Skill skill) {
        SkillResponse response = new SkillResponse();
        response.setId(skill.getId());
        response.setName(skill.getName());
        response.setLevel(skill.getLevel());
        response.setCategory(skill.getCategory());
        response.setDisplayOrder(skill.getDisplayOrder());
        response.setCreatedAt(skill.getCreatedAt());
        response.setUpdatedAt(skill.getUpdatedAt());
        return response;
    }

    public void updateEntity(Skill skill, UpdateSkillRequest request) {
        skill.setName(request.getName());
        skill.setLevel(request.getLevel());
        skill.setCategory(request.getCategory());
        skill.setDisplayOrder(request.getDisplayOrder());
    }
}
