package com.tripplannerz.domain.trip.repository;

import com.tripplannerz.domain.trip.entity.TripItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripItemRepository extends JpaRepository<TripItem, Long> {

    List<TripItem> findAllByTripIdOrderByDayNumberAscSortOrderAsc(Long tripId);

    Optional<TripItem> findByIdAndTripId(Long id, Long tripId);
}
