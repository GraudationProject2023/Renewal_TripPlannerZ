package com.tripplannerz.domain.companion.entity;

import com.tripplannerz.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 동행 모집글에 대한 지원. (companion_id, applicant_id) 조합은 유일(중복 지원 금지). */
@Getter
@Entity
@Table(
        name = "companion_application",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uq_companion_applicant",
                        columnNames = {"companion_id", "applicant_id"}))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CompanionApplication extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "companion_id", nullable = false)
    private Long companionId;

    @Column(name = "applicant_id", nullable = false)
    private Long applicantId;

    @Column(columnDefinition = "text")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status;

    @Builder
    private CompanionApplication(Long companionId, Long applicantId, String message) {
        this.companionId = companionId;
        this.applicantId = applicantId;
        this.message = message;
        this.status = ApplicationStatus.PENDING;
    }

    public void accept() {
        this.status = ApplicationStatus.ACCEPTED;
    }

    public void reject() {
        this.status = ApplicationStatus.REJECTED;
    }

    public boolean isPending() {
        return this.status == ApplicationStatus.PENDING;
    }
}
