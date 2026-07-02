package com.tripplannerz.domain.companion.mapper;

import com.tripplannerz.domain.companion.dto.CompanionResponse;
import com.tripplannerz.domain.companion.dto.CompanionSummaryResponse;
import com.tripplannerz.domain.companion.entity.Companion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanionMapper {

    CompanionResponse toResponse(Companion companion);

    CompanionSummaryResponse toSummary(Companion companion);
}
