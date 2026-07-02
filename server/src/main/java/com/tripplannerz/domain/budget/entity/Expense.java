package com.tripplannerz.domain.budget.entity;

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

/** 여행 중 발생한 지출 1건. payerId가 지불했고, ExpenseShare로 참여자에게 분배된다. */
@Getter
@Entity
@Table(name = "expense")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Expense extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /** 지불자(member id). */
    @Column(name = "payer_id", nullable = false)
    private Long payerId;

    /** 금액(원 단위). */
    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExpenseCategory category;

    @Column(length = 200)
    private String description;

    @Column(name = "spent_on", nullable = false)
    private LocalDate spentOn;

    @Builder
    private Expense(
            Long tripId,
            Long payerId,
            Long amount,
            ExpenseCategory category,
            String description,
            LocalDate spentOn) {
        this.tripId = tripId;
        this.payerId = payerId;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.spentOn = spentOn;
    }
}
