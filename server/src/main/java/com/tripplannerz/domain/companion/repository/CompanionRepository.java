package com.tripplannerz.domain.companion.repository;

import com.tripplannerz.domain.companion.entity.Companion;
import com.tripplannerz.domain.companion.entity.CompanionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanionRepository extends JpaRepository<Companion, Long> {

    Page<Companion> findAllByStatus(CompanionStatus status, Pageable pageable);

    Page<Companion> findAllByHostId(Long hostId, Pageable pageable);
}
