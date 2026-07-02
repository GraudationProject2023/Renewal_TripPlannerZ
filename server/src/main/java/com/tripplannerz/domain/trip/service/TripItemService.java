package com.tripplannerz.domain.trip.service;

import com.tripplannerz.domain.trip.dto.TripItemCreateRequest;
import com.tripplannerz.domain.trip.dto.TripItemReorderRequest;
import com.tripplannerz.domain.trip.dto.TripItemResponse;
import com.tripplannerz.domain.trip.entity.Trip;
import com.tripplannerz.domain.trip.entity.TripItem;
import com.tripplannerz.domain.trip.mapper.TripItemMapper;
import com.tripplannerz.domain.trip.repository.TripItemRepository;
import com.tripplannerz.domain.trip.repository.TripRepository;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TripItemService {

    private final TripItemRepository tripItemRepository;
    private final TripRepository tripRepository;
    private final TripItemMapper tripItemMapper;

    @Transactional
    public TripItemResponse add(Long tripId, Long memberId, TripItemCreateRequest request) {
        requireOwnedTrip(tripId, memberId);
        TripItem item = TripItem.builder()
                .tripId(tripId)
                .dayNumber(request.dayNumber())
                .sortOrder(request.sortOrder())
                .placeName(request.placeName())
                .memo(request.memo())
                .estimatedCost(request.estimatedCost())
                .stayMinutes(request.stayMinutes())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .build();
        return tripItemMapper.toResponse(tripItemRepository.save(item));
    }

    public List<TripItemResponse> list(Long tripId, Long memberId) {
        requireReadableTrip(tripId, memberId);
        return tripItemRepository.findAllByTripIdOrderByDayNumberAscSortOrderAsc(tripId).stream()
                .map(tripItemMapper::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long tripId, Long itemId, Long memberId) {
        requireOwnedTrip(tripId, memberId);
        TripItem item = tripItemRepository.findByIdAndTripId(itemId, tripId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
        tripItemRepository.delete(item);
    }

    /** 드래그 앤 드롭 결과를 일괄 반영. 요청 항목이 해당 여행 소속인지 확인 후 dirty checking으로 저장. */
    @Transactional
    public void reorder(Long tripId, Long memberId, TripItemReorderRequest request) {
        requireOwnedTrip(tripId, memberId);
        Map<Long, TripItem> itemsById =
                tripItemRepository.findAllByTripIdOrderByDayNumberAscSortOrderAsc(tripId).stream()
                        .collect(Collectors.toMap(TripItem::getId, Function.identity()));
        for (TripItemReorderRequest.ItemOrder order : request.orders()) {
            TripItem item = itemsById.get(order.itemId());
            if (item == null) {
                throw new BusinessException(ErrorCode.NOT_FOUND);
            }
            item.moveTo(order.dayNumber(), order.sortOrder());
        }
    }

    private void requireOwnedTrip(Long tripId, Long memberId) {
        if (!findTrip(tripId).isOwnedBy(memberId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    }

    private void requireReadableTrip(Long tripId, Long memberId) {
        Trip trip = findTrip(tripId);
        if (!trip.isPublic() && !trip.isOwnedBy(memberId)) {
            throw new BusinessException(ErrorCode.TRIP_NOT_FOUND);
        }
    }

    private Trip findTrip(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRIP_NOT_FOUND));
    }
}
