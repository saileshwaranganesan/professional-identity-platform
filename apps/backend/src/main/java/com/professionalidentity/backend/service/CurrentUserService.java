package com.professionalidentity.backend.service;

import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.exception.UnauthorizedException;
import com.professionalidentity.backend.repository.UserRepository;
import com.professionalidentity.backend.security.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CurrentUserService {

    private static final Logger log = LoggerFactory.getLogger(CurrentUserService.class);

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean authNull = (authentication == null);
        String authClass = (authentication != null) ? authentication.getClass().getName() : "null";
        Object principal = (authentication != null) ? authentication.getPrincipal() : null;
        String principalClass = (principal != null) ? principal.getClass().getName() : "null";
        String principalUsername = (principal instanceof CustomUserDetails cud) ? cud.getUsername() : (authentication != null ? authentication.getName() : "null");
        UUID principalUserId = (principal instanceof CustomUserDetails cud) ? cud.getUserId() : null;

        log.info("[AUTH-DEBUG] CurrentUserService getCurrentUser | authenticationNull: {} | authClass: {} | principalClass: {} | principalUsername: {} | principalUserId: {}",
                authNull, authClass, principalClass, principalUsername, principalUserId);

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            log.error("[AUTH-DEBUG] CurrentUserService SecurityContext validation FAILED -> Throwing UnauthorizedException");
            throw new UnauthorizedException();
        }

        Optional<User> userOpt = userRepository.findById(userDetails.getUserId());
        log.info("[AUTH-DEBUG] CurrentUserService findById(userId: {}) | userFoundInDb: {}",
                userDetails.getUserId(), userOpt.isPresent());

        return userOpt.orElseThrow(() -> {
            log.error("[AUTH-DEBUG] CurrentUserService findById returned empty -> Throwing UnauthorizedException");
            return new UnauthorizedException();
        });
    }

    public Profile getCurrentProfile() {
        Profile profile = getCurrentUser().getProfile();
        if (profile == null) {
            throw new UnauthorizedException();
        }
        return profile;
    }
}
