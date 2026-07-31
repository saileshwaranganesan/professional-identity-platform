package com.professionalidentity.backend.repository;

import com.professionalidentity.backend.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EducationRepository extends JpaRepository<Education, UUID> {

    List<Education> findByProfileId(UUID profileId);

    boolean existsByProfileId(UUID profileId);

    Optional<Education> findByIdAndProfileId(UUID educationId, UUID profileId);
}
