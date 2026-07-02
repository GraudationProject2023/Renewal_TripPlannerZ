package com.tripplannerz.domain.companion.service;

import com.tripplannerz.domain.companion.dto.CompanionCreateRequest;
import com.tripplannerz.domain.companion.dto.CompanionResponse;
import com.tripplannerz.domain.companion.dto.CompanionSummaryResponse;
import com.tripplannerz.domain.companion.dto.CompanionUpdateRequest;
import com.tripplannerz.domain.companion.entity.Companion;
import com.tripplannerz.domain.companion.entity.CompanionStatus;
import com.tripplannerz.domain.chat.service.ChatService;
import com.tripplannerz.domain.companion.mapper.CompanionMapper;
import com.tripplannerz.domain.companion.repository.CompanionRepository;
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
public class CompanionService {

    private final CompanionRepository companionRepository;
    private final CompanionMapper companionMapper;
    private final ChatService chatService;

    @Transactional
    public CompanionResponse create(Long hostId, CompanionCreateRequest request) {
        validatePeriod(request.startDate(), request.endDate());
        Companion companion = Companion.builder()
                .hostId(hostId)
                .tripId(request.tripId())
                .title(request.title())
                .content(request.content())
                .destination(request.destination())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .capacity(request.capacity())
                .budget(request.budget())
                .build();
        Companion saved = companionRepository.save(companion);
        chatService.createRoom(saved.getId(), hostId); // 동행 채팅방 생성 + 호스트 참여
        return companionMapper.toResponse(saved);
    }

    public CompanionResponse getById(Long companionId) {
        return companionMapper.toResponse(findById(companionId));
    }

    public PageResponse<CompanionSummaryResponse> getRecruiting(Pageable pageable) {
        return PageResponse.from(
                companionRepository.findAllByStatus(CompanionStatus.RECRUITING, pageable)
                        .map(companionMapper::toSummary));
    }

    public PageResponse<CompanionSummaryResponse> getMine(Long hostId, Pageable pageable) {
        return PageResponse.from(
                companionRepository.findAllByHostId(hostId, pageable).map(companionMapper::toSummary));
    }

    @Transactional
    public CompanionResponse update(Long companionId, Long memberId, CompanionUpdateRequest request) {
        validatePeriod(request.startDate(), request.endDate());
        Companion companion = findHosted(companionId, memberId);
        companion.update(
                request.title(),
                request.content(),
                request.destination(),
                request.startDate(),
                request.endDate(),
                request.capacity(),
                request.budget(),
                request.tripId());
        return companionMapper.toResponse(companion);
    }

    @Transactional
    public void close(Long companionId, Long memberId) {
        findHosted(companionId, memberId).close();
    }

    private Companion findById(Long companionId) {
        return companionRepository.findById(companionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMPANION_NOT_FOUND));
    }

    private Companion findHosted(Long companionId, Long memberId) {
        Companion companion = findById(companionId);
        if (!companion.isHostedBy(memberId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return companion;
    }

    private void validatePeriod(LocalDate start, LocalDate end) {
        if (end.isBefore(start)) {
            throw new BusinessException(ErrorCode.COMPANION_INVALID_PERIOD);
        }
    }
}
