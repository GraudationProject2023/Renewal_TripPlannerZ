package com.tripplannerz.domain.companion.service;

import com.tripplannerz.domain.companion.dto.ApplicationCreateRequest;
import com.tripplannerz.domain.companion.dto.ApplicationResponse;
import com.tripplannerz.domain.companion.entity.ApplicationStatus;
import com.tripplannerz.domain.companion.entity.Companion;
import com.tripplannerz.domain.companion.entity.CompanionApplication;
import com.tripplannerz.domain.companion.mapper.CompanionApplicationMapper;
import com.tripplannerz.domain.companion.repository.CompanionApplicationRepository;
import com.tripplannerz.domain.companion.repository.CompanionRepository;
import com.tripplannerz.domain.notification.entity.NotificationType;
import com.tripplannerz.domain.notification.service.NotificationService;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanionApplicationService {

    private final CompanionApplicationRepository applicationRepository;
    private final CompanionRepository companionRepository;
    private final CompanionApplicationMapper applicationMapper;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse apply(Long companionId, Long applicantId, ApplicationCreateRequest request) {
        Companion companion = findCompanion(companionId);
        if (companion.isHostedBy(applicantId)) {
            throw new BusinessException(ErrorCode.CANNOT_APPLY_OWN);
        }
        if (!companion.isRecruiting()) {
            throw new BusinessException(ErrorCode.COMPANION_NOT_RECRUITING);
        }
        if (applicationRepository.existsByCompanionIdAndApplicantId(companionId, applicantId)) {
            throw new BusinessException(ErrorCode.DUPLICATE_APPLICATION);
        }
        CompanionApplication application = CompanionApplication.builder()
                .companionId(companionId)
                .applicantId(applicantId)
                .message(request.message())
                .build();
        CompanionApplication saved = applicationRepository.save(application);
        notificationService.create(
                companion.getHostId(),
                NotificationType.COMPANION_APPLICATION_RECEIVED,
                "새로운 동행 지원이 도착했습니다.",
                companionId);
        return applicationMapper.toResponse(saved);
    }

    public List<ApplicationResponse> list(Long companionId, Long memberId) {
        requireHost(companionId, memberId);
        return applicationRepository.findAllByCompanionId(companionId).stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    /** 수락. 정원(호스트 제외) 초과 시 거부하고, 정원이 차면 모집을 자동 마감한다. */
    @Transactional
    public ApplicationResponse accept(Long companionId, Long applicationId, Long memberId) {
        Companion companion = requireHost(companionId, memberId);
        CompanionApplication application = findApplication(applicationId, companionId);
        long accepted = applicationRepository.countByCompanionIdAndStatus(companionId, ApplicationStatus.ACCEPTED);
        if (accepted >= companion.acceptableSlots()) {
            throw new BusinessException(ErrorCode.COMPANION_FULL);
        }
        application.accept();
        if (accepted + 1 >= companion.acceptableSlots()) {
            companion.close();
        }
        notificationService.create(
                application.getApplicantId(),
                NotificationType.COMPANION_APPLICATION_ACCEPTED,
                "동행 지원이 수락되었습니다.",
                companionId);
        return applicationMapper.toResponse(application);
    }

    @Transactional
    public ApplicationResponse reject(Long companionId, Long applicationId, Long memberId) {
        requireHost(companionId, memberId);
        CompanionApplication application = findApplication(applicationId, companionId);
        application.reject();
        notificationService.create(
                application.getApplicantId(),
                NotificationType.COMPANION_APPLICATION_REJECTED,
                "동행 지원이 거절되었습니다.",
                companionId);
        return applicationMapper.toResponse(application);
    }

    private Companion requireHost(Long companionId, Long memberId) {
        Companion companion = findCompanion(companionId);
        if (!companion.isHostedBy(memberId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return companion;
    }

    private Companion findCompanion(Long companionId) {
        return companionRepository.findById(companionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMPANION_NOT_FOUND));
    }

    private CompanionApplication findApplication(Long applicationId, Long companionId) {
        return applicationRepository.findByIdAndCompanionId(applicationId, companionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.APPLICATION_NOT_FOUND));
    }
}
