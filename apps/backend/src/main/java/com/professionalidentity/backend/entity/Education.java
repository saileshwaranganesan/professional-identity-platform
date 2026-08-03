package com.professionalidentity.backend.entity;

import com.professionalidentity.backend.entity.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "educations")
@NoArgsConstructor
public class Education extends BaseEntity {

    @Column(name = "institution", nullable = false, length = 200)
    private String institution;

    @Column(name = "degree", nullable = false, length = 200)
    private String degree;

    @Column(name = "field_of_study", length = 200)
    private String fieldOfStudy;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "grade", length = 100)
    private String grade;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "currently_studying", nullable = false)
    private boolean currentlyStudying;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;
}
