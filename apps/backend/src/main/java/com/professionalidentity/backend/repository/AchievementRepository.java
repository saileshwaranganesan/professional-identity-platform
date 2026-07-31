package com.professionalidentity.backend.repository;

import com.professionalidentity.backend.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, UUID> {

    List<Achievement> findByProfileIdOrderByDisplayOrderAsc(UUID profileId);

    boolean existsByProfileId(UUID profileId);

    Optional<Achievement> findByIdAndProfileId(UUID achievementId, UUID profileId);
}
