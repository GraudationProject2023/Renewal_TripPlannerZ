package com.tripplannerz.domain.budget.repository;

import com.tripplannerz.domain.budget.entity.Expense;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByTripIdOrderBySpentOnAsc(Long tripId);

    Optional<Expense> findByIdAndTripId(Long id, Long tripId);
}
