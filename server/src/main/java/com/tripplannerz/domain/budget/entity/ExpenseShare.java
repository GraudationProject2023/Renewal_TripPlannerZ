package com.tripplannerz.domain.budget.entity;

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

/** 지출 1건에 대한 참여자별 분담액. tripId는 정산 집계 편의를 위해 비정규화 보관. */
@Getter
@Entity
@Table(name = "expense_share")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExpenseShare extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "expense_id", nullable = false)
    private Long expenseId;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /** 분담 대상(member id). */
    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "share_amount", nullable = false)
    private long shareAmount;

    @Builder
    private ExpenseShare(Long expenseId, Long tripId, Long memberId, long shareAmount) {
        this.expenseId = expenseId;
        this.tripId = tripId;
        this.memberId = memberId;
        this.shareAmount = shareAmount;
    }
}
