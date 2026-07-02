package com.tripplannerz.domain.budget.dto;

import com.tripplannerz.domain.budget.entity.ExpenseCategory;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

/** participantIds 사이에서 amount를 균등 분할(N빵)한다. */
public record ExpenseCreateRequest(
        @NotNull Long payerId,
        @NotNull @Positive Long amount,
        @NotNull ExpenseCategory category,
        @Size(max = 200) String description,
        @NotNull LocalDate spentOn,
        @NotEmpty List<Long> participantIds) {
}
