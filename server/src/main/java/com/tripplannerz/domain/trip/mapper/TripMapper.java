package com.tripplannerz.domain.trip.mapper;

import com.tripplannerz.domain.trip.dto.TripResponse;
import com.tripplannerz.domain.trip.dto.TripSummaryResponse;
import com.tripplannerz.domain.trip.entity.Trip;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TripMapper {

    TripResponse toResponse(Trip trip);

    TripSummaryResponse toSummary(Trip trip);
}
