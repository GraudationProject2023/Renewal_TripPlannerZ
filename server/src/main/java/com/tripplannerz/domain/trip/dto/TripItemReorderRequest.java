package com.tripplannerz.domain.trip.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.List;

/** 타임라인 드래그 앤 드롭 결과를 일괄 반영. 각 항목의 새 일차/순서를 전달한다. */
public record TripItemReorderRequest(
        @NotEmpty @Valid List<ItemOrder> orders) {

    public record ItemOrder(
            @NotNull Long itemId,
            @NotNull @Positive Integer dayNumber,
            @NotNull @PositiveOrZero Integer sortOrder) {
    }
}
