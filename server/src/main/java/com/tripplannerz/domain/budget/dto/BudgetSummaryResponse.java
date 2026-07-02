package com.tripplannerz.domain.budget.dto;

import com.tripplannerz.domain.budget.entity.ExpenseCategory;
import java.util.List;

/** 계획 예산(trip.budget) 대비 실제 지출 요약. plannedBudget/remaining은 미설정 시 null. */
public record BudgetSummaryResponse(
        Long plannedBudget,
        long totalSpent,
        Long remaining,
        List<CategorySpend> byCategory) {

    public record CategorySpend(ExpenseCategory category, long amount) {
    }
}
