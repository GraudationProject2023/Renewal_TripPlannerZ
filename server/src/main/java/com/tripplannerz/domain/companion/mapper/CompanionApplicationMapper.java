package com.tripplannerz.domain.companion.mapper;

import com.tripplannerz.domain.companion.dto.ApplicationResponse;
import com.tripplannerz.domain.companion.entity.CompanionApplication;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanionApplicationMapper {

    ApplicationResponse toResponse(CompanionApplication application);
}
