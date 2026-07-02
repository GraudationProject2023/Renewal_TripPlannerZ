package com.tripplannerz.domain.companion.repository;

import com.tripplannerz.domain.companion.entity.ApplicationStatus;
import com.tripplannerz.domain.companion.entity.CompanionApplication;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanionApplicationRepository extends JpaRepository<CompanionApplication, Long> {

    boolean existsByCompanionIdAndApplicantId(Long companionId, Long applicantId);

    Optional<CompanionApplication> findByIdAndCompanionId(Long id, Long companionId);

    List<CompanionApplication> findAllByCompanionId(Long companionId);

    long countByCompanionIdAndStatus(Long companionId, ApplicationStatus status);
}
