package com.professionalidentity.backend.entity;

import com.professionalidentity.backend.entity.audit.BaseEntity;
import com.professionalidentity.backend.entity.enums.EmploymentStatus;
import com.professionalidentity.backend.entity.enums.EmploymentType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(
        name = "experiences",
        indexes = {
                @Index(name = "idx_experiences_profile_display_order", columnList = "profile_id, display_order")
        }
)
@NoArgsConstructor
public class Experience extends BaseEntity {

    @Column(name = "company", nullable = false, length = 200)
    private String company;

    @Column(name = "position", nullable = false, length = 200)
    private String position;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", nullable = false, length = 20)
    private EmploymentType employmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status", nullable = false, length = 20)
    private EmploymentStatus employmentStatus;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "technologies", columnDefinition = "TEXT")
    private String technologies;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "currently_working", nullable = false)
    private boolean currentlyWorking;

    @Column(name = "company_website", length = 500)
    private String companyWebsite;

    @Column(name = "company_logo", length = 500)
    private String companyLogo;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;
}
