package com.tripplannerz.domain.trip.entity;

import com.tripplannerz.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 여행 일정 내 방문 장소. day_number(일차) + sort_order(동선 순서)로 타임라인을 구성한다. */
@Getter
@Entity
@Table(name = "trip_item")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TripItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 소속 여행 식별자. 소유·접근 검증은 Trip을 통해 수행한다. */
    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    @Column(name = "day_number", nullable = false)
    private int dayNumber;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "place_name", nullable = false, length = 200)
    private String placeName;

    @Column(columnDefinition = "text")
    private String memo;

    /** 예상 비용(원 단위). 미설정 가능. */
    @Column(name = "estimated_cost")
    private Long estimatedCost;

    /** 체류 시간(분). 미설정 가능. */
    @Column(name = "stay_minutes")
    private Integer stayMinutes;

    /** 위도. 경로 최적화에 사용. 미설정 가능. */
    @Column
    private Double latitude;

    /** 경도. 경로 최적화에 사용. 미설정 가능. */
    @Column
    private Double longitude;

    @Builder
    private TripItem(
            Long tripId,
            int dayNumber,
            int sortOrder,
            String placeName,
            String memo,
            Long estimatedCost,
            Integer stayMinutes,
            Double latitude,
            Double longitude) {
        this.tripId = tripId;
        this.dayNumber = dayNumber;
        this.sortOrder = sortOrder;
        this.placeName = placeName;
        this.memo = memo;
        this.estimatedCost = estimatedCost;
        this.stayMinutes = stayMinutes;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public boolean hasCoordinates() {
        return this.latitude != null && this.longitude != null;
    }

    /** 드래그 앤 드롭 재정렬 시 일차/순서를 이동한다. */
    public void moveTo(int dayNumber, int sortOrder) {
        this.dayNumber = dayNumber;
        this.sortOrder = sortOrder;
    }
}
