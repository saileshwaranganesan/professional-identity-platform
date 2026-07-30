package com.professionalidentity.backend.entity;

import com.professionalidentity.backend.entity.audit.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "profiles")
@NoArgsConstructor
public class Profile extends BaseEntity {

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "headline", length = 255)
    private String headline;

    @Column(name = "bio", length = 5000)
    private String bio;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "website", length = 512)
    private String website;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "profile_image_path", length = 512)
    private String profileImagePath;

    @Column(name = "banner_image_path", length = 512)
    private String bannerImagePath;

    @OneToOne(mappedBy = "profile", fetch = FetchType.LAZY)
    private User user;

    @OneToMany(
            mappedBy = "profile",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Project> projects = new ArrayList<>();

    @OneToMany(
            mappedBy = "profile",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<Experience> experiences = new ArrayList<>();
}
