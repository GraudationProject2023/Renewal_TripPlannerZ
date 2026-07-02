package com.tripplannerz.domain.trip.service;

import com.tripplannerz.domain.trip.dto.TripCreateRequest;
import com.tripplannerz.domain.trip.dto.TripResponse;
import com.tripplannerz.domain.trip.dto.TripSummaryResponse;
import com.tripplannerz.domain.trip.dto.TripUpdateRequest;
import com.tripplannerz.domain.trip.entity.Trip;
import com.tripplannerz.domain.trip.mapper.TripMapper;
import com.tripplannerz.domain.trip.repository.TripRepository;
import com.tripplannerz.global.common.PageResponse;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TripService {

    private final TripRepository tripRepository;
    private final TripMapper tripMapper;

    @Transactional
    public TripResponse create(Long ownerId, TripCreateRequest request) {
        validatePeriod(request.startDate(), request.endDate());
        Trip trip = Trip.builder()
                .ownerId(ownerId)
                .title(request.title())
                .destination(request.destination())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .budget(request.budget())
                .visibility(request.visibility())
                .build();
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    /** 공개 일정은 누구나, 비공개는 소유자만 조회. 비공개 타인 접근은 존재 자체를 숨긴다(404). */
    public TripResponse getReadable(Long tripId, Long memberId) {
        Trip trip = findById(tripId);
        if (!trip.isPublic() && !trip.isOwnedBy(memberId)) {
            throw new BusinessException(ErrorCode.TRIP_NOT_FOUND);
        }
        return tripMapper.toResponse(trip);
    }

    public PageResponse<TripSummaryResponse> getMine(Long ownerId, Pageable pageable) {
        return PageResponse.from(
                tripRepository.findAllByOwnerId(ownerId, pageable).map(tripMapper::toSummary));
    }

    @Transactional
    public TripResponse update(Long tripId, Long memberId, TripUpdateRequest request) {
        validatePeriod(request.startDate(), request.endDate());
        Trip trip = findOwned(tripId, memberId);
        trip.update(
                request.title(),
                request.destination(),
                request.startDate(),
                request.endDate(),
                request.budget(),
                request.visibility());
        return tripMapper.toResponse(trip);
    }

    @Transactional
    public void delete(Long tripId, Long memberId) {
        tripRepository.delete(findOwned(tripId, memberId));
    }

    private Trip findById(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));
    }

    private Trip findOwned(Long tripId, Long memberId) {
        Trip trip = findById(tripId);
        if (!trip.isOwnedBy(memberId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return trip;
    }

    private void validatePeriod(LocalDate start, LocalDate end) {
        if (end.isBefore(start)) {
            throw new BusinessException(ErrorCode.TRIP_INVALID_PERIOD);
        }
    }
}
