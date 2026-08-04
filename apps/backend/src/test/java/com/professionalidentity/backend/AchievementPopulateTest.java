package com.professionalidentity.backend;

import com.professionalidentity.backend.entity.Achievement;
import com.professionalidentity.backend.entity.Profile;
import com.professionalidentity.backend.repository.AchievementRepository;
import com.professionalidentity.backend.repository.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5433/professional_identity",
    "spring.datasource.username=postgres",
    "spring.datasource.password=root",
    "spring.datasource.driver-class-name=org.postgresql.Driver",
    "spring.jpa.hibernate.ddl-auto=none",
    "spring.flyway.enabled=false"
})
public class AchievementPopulateTest {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    private static class AchDef {
        String title;
        String organization;
        LocalDate achievementDate;
        String description;
        String achievementUrl;
        int displayOrder;

        AchDef(String title, String organization, LocalDate achievementDate, String description, String achievementUrl, int displayOrder) {
            this.title = title;
            this.organization = organization;
            this.achievementDate = achievementDate;
            this.description = description;
            this.achievementUrl = achievementUrl;
            this.displayOrder = displayOrder;
        }
    }

    @Test
    public void populateAchievements() {
        System.out.println("==================================================");
        System.out.println("1. RESOLVING PROFILE RECORD");
        System.out.println("==================================================");

        Profile profile = profileRepository.findFirstByOrderByCreatedAtAsc()
                .orElseThrow(() -> new IllegalStateException("No Profile record found in database!"));

        System.out.println("Resolved Profile:");
        System.out.println(" -> Profile ID: " + profile.getId());
        System.out.println(" -> Name: " + profile.getFirstName() + " " + profile.getLastName());

        AchDef[] targetAchievements = new AchDef[]{
                new AchDef(
                        "Solved 400+ Data Structures & Algorithms Problems",
                        "LeetCode",
                        LocalDate.of(2026, 8, 4),
                        "Solved 400+ coding problems across Easy, Medium, and Hard difficulty levels while maintaining over 300 active coding days and an 85-day maximum solving streak. Developed strong expertise in data structures, algorithms, dynamic programming, graphs, trees, greedy algorithms, and advanced problem-solving through consistent practice.",
                        "https://leetcode.com/u/saileshwaran350/",
                        1
                ),
                new AchDef(
                        "Oracle Certified Professional: Java SE 21 Developer",
                        "Oracle",
                        LocalDate.of(2025, 11, 27),
                        "Earned the Oracle Certified Professional: Java SE 21 Developer certification, validating advanced proficiency in modern Java, object-oriented programming, collections, streams, exception handling, concurrency, and enterprise application development based on the latest Java SE 21 standards.",
                        "https://catalog-education.oracle.com/pls/certview/sharebadge?id=720160E39C7088974BB9E6A375D3BF504B1D5879F8E232CF458704E3BB9EAE0D",
                        2
                ),
                new AchDef(
                        "Architected & Deployed a Production-Ready Full-Stack Portfolio Platform",
                        "Personal Engineering Project",
                        LocalDate.of(2026, 8, 4),
                        "Independently architected, developed, and deployed a production-ready full-stack portfolio platform featuring a secure Spring Boot backend, React frontend, PostgreSQL database, JWT authentication, and a complete administrative content management system following modern software engineering, scalable architecture, and security best practices.",
                        "https://professional-identity-platform.onrender.com",
                        3
                ),
                new AchDef(
                        "Completed Microsoft AINNOVATION 2025 AI Learning Challenges",
                        "Microsoft",
                        LocalDate.of(2025, 8, 31),
                        "Successfully completed Microsoft Applied AI, Microsoft AI, and Microsoft Azure Learning Challenges, strengthening practical knowledge in artificial intelligence, cloud computing, and modern AI technologies through hands-on learning and technical assessments.",
                        "https://learn.microsoft.com/",
                        4
                ),
                new AchDef(
                        "Designed & Developed Multiple Full-Stack and AI Software Solutions",
                        "Personal Projects",
                        LocalDate.of(2026, 8, 4),
                        "Designed and developed multiple end-to-end software solutions spanning full-stack web development, artificial intelligence, cybersecurity, blockchain-inspired systems, and distributed applications using Java, Spring Boot, React, PostgreSQL, Python, Node.js, and modern software engineering principles. Focused on building scalable, secure, and production-oriented applications from architecture through deployment.",
                        "https://github.com/saileshwaranganesan",
                        5
                )
        };

        List<Achievement> existingList = achievementRepository.findByProfileIdOrderByDisplayOrderAsc(profile.getId());
        Map<String, Achievement> existingMap = new HashMap<>();
        for (Achievement a : existingList) {
            existingMap.put(a.getTitle().toLowerCase(), a);
        }

        System.out.println("\n==================================================");
        System.out.println("2. PROCESSING ACHIEVEMENTS (UPSERT)");
        System.out.println("==================================================");

        Map<String, String> statusReport = new HashMap<>();
        Map<String, String> idReport = new HashMap<>();

        for (AchDef def : targetAchievements) {
            String key = def.title.toLowerCase();
            Achievement achToSave;
            boolean isUpdate = existingMap.containsKey(key);

            if (isUpdate) {
                achToSave = existingMap.get(key);
                statusReport.put(def.title, "UPDATED");
                System.out.println("[UPDATED] Existing achievement '" + def.title + "' (ID: " + achToSave.getId() + ")");
            } else {
                achToSave = new Achievement();
                achToSave.setProfile(profile);
                statusReport.put(def.title, "INSERTED");
                System.out.println("[INSERTED] New achievement '" + def.title + "'");
            }

            achToSave.setTitle(def.title);
            achToSave.setOrganization(def.organization);
            achToSave.setAchievementDate(def.achievementDate);
            achToSave.setDescription(def.description);
            achToSave.setAchievementUrl(def.achievementUrl);
            achToSave.setDisplayOrder(def.displayOrder);

            Achievement saved = achievementRepository.save(achToSave);
            idReport.put(def.title, saved.getId().toString());
        }

        System.out.println("\n==================================================");
        System.out.println("3. VERIFYING DATABASE CONTENTS FOR ACHIEVEMENTS");
        System.out.println("==================================================");

        List<Achievement> finalAchievements = achievementRepository.findByProfileIdOrderByDisplayOrderAsc(profile.getId());
        Set<String> uniqueTitles = new HashSet<>();
        boolean duplicatesFound = false;

        System.out.println("Total Achievements for Profile: " + finalAchievements.size());
        for (Achievement a : finalAchievements) {
            System.out.println(" -> Display Order: " + a.getDisplayOrder());
            System.out.println("    ID: " + a.getId());
            System.out.println("    Title: " + a.getTitle());
            System.out.println("    Organization: " + a.getOrganization());
            System.out.println("    Achievement Date: " + a.getAchievementDate());
            System.out.println("    Description: " + a.getDescription());
            System.out.println("    Achievement URL: " + a.getAchievementUrl());
            System.out.println("    Profile ID: " + a.getProfile().getId());
            System.out.println("    Created At: " + a.getCreatedAt());
            System.out.println("    Updated At: " + a.getUpdatedAt());

            if (!uniqueTitles.add(a.getTitle().toLowerCase())) {
                duplicatesFound = true;
                System.err.println("    !!! DUPLICATE DETECTED for title: " + a.getTitle());
            }
        }

        System.out.println("\n==================================================");
        System.out.println("SUMMARY REPORT:");
        System.out.println("==================================================");
        for (AchDef def : targetAchievements) {
            System.out.println(" -> " + def.title + ":");
            System.out.println("    Status: " + statusReport.get(def.title));
            System.out.println("    ID: " + idReport.get(def.title));
        }
        System.out.println("Duplicates Found: " + (duplicatesFound ? "YES (FAIL)" : "NO (CONFIRMED 5 UNIQUE ACHIEVEMENTS)"));
        System.out.println("==================================================");
    }
}
