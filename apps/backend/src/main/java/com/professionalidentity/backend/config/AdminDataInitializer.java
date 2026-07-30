package com.professionalidentity.backend.config;

import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.entity.User;
import com.professionalidentity.backend.entity.enums.Role;
import com.professionalidentity.backend.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProperties;

    public AdminDataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AdminProperties adminProperties
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminProperties = adminProperties;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            return;
        }

        Profile profile = new Profile();
        profile.setFirstName(adminProperties.name());

        User admin = new User();
        admin.setEmail(adminProperties.email());
        admin.setPassword(passwordEncoder.encode(adminProperties.password()));
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);
        admin.setProfile(profile);

        userRepository.save(admin);
    }
}
