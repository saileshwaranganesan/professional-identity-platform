package com.professionalidentity.backend.security;

import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Optional<User> userOpt = userRepository.findByEmail(username);
        log.info("[AUTH-DEBUG] CustomUserDetailsService loadUserByUsername | requestedEmail: {} | userFound: {} | userId: {} | enabled: {}",
                username,
                userOpt.isPresent(),
                userOpt.map(User::getId).orElse(null),
                userOpt.map(User::isEnabled).orElse(false));

        return userOpt
                .map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }
}
