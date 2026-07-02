package com.tripplannerz.domain.budget.repository;

import com.tripplannerz.domain.budget.entity.ExpenseShare;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseShareRepository extends JpaRepository<ExpenseShare, Long> {

    List<ExpenseShare> findAllByTripId(Long tripId);
}
