package com.tripplannerz.domain.trip.mapper;

import com.tripplannerz.domain.trip.dto.TripItemResponse;
import com.tripplannerz.domain.trip.entity.TripItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TripItemMapper {

    TripItemResponse toResponse(TripItem tripItem);
}
