package com.tripplannerz.domain.trip.entity;

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

@Getter
@Entity
@Table(name = "trip")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Trip extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 다른 도메인(member) 엔티티를 직접 참조하지 않고 식별자만 보관한다. */
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 100)
    private String destination;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /** 계획 예산(원 단위). 미설정 가능. */
    @Column
    private Long budget;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Visibility visibility;

    @Builder
    private Trip(
            Long ownerId,
            String title,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            Long budget,
            Visibility visibility) {
        this.ownerId = ownerId;
        this.title = title;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.visibility = visibility;
    }

    public void update(
            String title,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            Long budget,
            Visibility visibility) {
        this.title = title;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.visibility = visibility;
    }

    public boolean isOwnedBy(Long memberId) {
        return this.ownerId.equals(memberId);
    }

    public boolean isPublic() {
        return this.visibility == Visibility.PUBLIC;
    }
}
