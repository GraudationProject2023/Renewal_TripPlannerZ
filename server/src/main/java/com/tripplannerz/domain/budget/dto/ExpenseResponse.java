package com.tripplannerz.domain.budget.dto;

import com.tripplannerz.domain.budget.entity.ExpenseCategory;
import java.time.LocalDate;
import java.util.List;

public record ExpenseResponse(
        Long id,
        Long tripId,
        Long payerId,
        Long amount,
        ExpenseCategory category,
        String description,
        LocalDate spentOn,
        List<ShareResponse> shares) {

    public record ShareResponse(Long memberId, long shareAmount) {
    }
}
