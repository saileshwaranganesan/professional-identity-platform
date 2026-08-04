package com.professionalidentity.backend.repository;

import com.professionalidentity.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "profile")
    Optional<User> findWithProfileById(UUID id);
}
