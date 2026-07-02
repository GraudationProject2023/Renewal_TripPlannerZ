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
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 동행 모집글. 호스트(host)가 모집하며, 선택적으로 특정 여행 일정(tripId)과 연결된다. */
@Getter
@Entity
@Table(name = "companion")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Companion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 모집 호스트(member id). 다른 도메인 엔티티를 직접 참조하지 않고 식별자만 보관. */
    @Column(name = "host_id", nullable = false)
    private Long hostId;

    /** 연결된 여행 일정(선택). */
    @Column(name = "trip_id")
    private Long tripId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "text")
    private String content;

    @Column(nullable = false, length = 100)
    private String destination;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /** 총 정원(호스트 포함). */
    @Column(nullable = false)
    private int capacity;

    /** 1인 예산대(원 단위). 미설정 가능. */
    @Column
    private Long budget;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CompanionStatus status;

    @Builder
    private Companion(
            Long hostId,
            Long tripId,
            String title,
            String content,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            int capacity,
            Long budget) {
        this.hostId = hostId;
        this.tripId = tripId;
        this.title = title;
        this.content = content;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.capacity = capacity;
        this.budget = budget;
        this.status = CompanionStatus.RECRUITING;
    }

    public void update(
            String title,
            String content,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            int capacity,
            Long budget,
            Long tripId) {
        this.title = title;
        this.content = content;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.capacity = capacity;
        this.budget = budget;
        this.tripId = tripId;
    }

    public void close() {
        this.status = CompanionStatus.CLOSED;
    }

    public boolean isHostedBy(Long memberId) {
        return this.hostId.equals(memberId);
    }

    public boolean isRecruiting() {
        return this.status == CompanionStatus.RECRUITING;
    }

    /** 정원 중 호스트를 제외하고 수락 가능한 최대 인원. */
    public int acceptableSlots() {
        return this.capacity - 1;
    }
}
