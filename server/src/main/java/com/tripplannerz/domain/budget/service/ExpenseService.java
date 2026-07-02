package com.tripplannerz.domain.budget.service;

import com.tripplannerz.domain.budget.dto.BudgetSummaryResponse;
import com.tripplannerz.domain.budget.dto.BudgetSummaryResponse.CategorySpend;
import com.tripplannerz.domain.budget.dto.ExpenseCreateRequest;
import com.tripplannerz.domain.budget.dto.ExpenseResponse;
import com.tripplannerz.domain.budget.dto.ExpenseResponse.ShareResponse;
import com.tripplannerz.domain.budget.entity.Expense;
import com.tripplannerz.domain.budget.entity.ExpenseCategory;
import com.tripplannerz.domain.budget.entity.ExpenseShare;
import com.tripplannerz.domain.budget.repository.ExpenseRepository;
import com.tripplannerz.domain.budget.repository.ExpenseShareRepository;
import com.tripplannerz.domain.trip.dto.TripResponse;
import com.tripplannerz.domain.trip.service.TripService;
import com.tripplannerz.global.error.BusinessException;
import com.tripplannerz.global.error.ErrorCode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseShareRepository expenseShareRepository;
    private final TripService tripService;

    @Transactional
    public ExpenseResponse create(Long tripId, Long memberId, ExpenseCreateRequest request) {
        assertTripOwner(tripId, memberId);
        Expense expense = expenseRepository.save(Expense.builder()
                .tripId(tripId)
                .payerId(request.payerId())
                .amount(request.amount())
                .category(request.category())
                .description(request.description())
                .spentOn(request.spentOn())
                .build());
        List<ExpenseShare> shares =
                splitEqually(tripId, expense.getId(), request.amount(), request.participantIds());
        expenseShareRepository.saveAll(shares);
        return toResponse(expense, shares);
    }

    public List<ExpenseResponse> list(Long tripId, Long memberId) {
        assertTripReadable(tripId, memberId);
        List<Expense> expenses = expenseRepository.findAllByTripIdOrderBySpentOnAsc(tripId);
        Map<Long, List<ExpenseShare>> sharesByExpense =
                expenseShareRepository.findAllByTripId(tripId).stream()
                        .collect(Collectors.groupingBy(ExpenseShare::getExpenseId));
        return expenses.stream()
                .map(e -> toResponse(e, sharesByExpense.getOrDefault(e.getId(), List.of())))
                .toList();
    }

    @Transactional
    public void delete(Long tripId, Long expenseId, Long memberId) {
        assertTripOwner(tripId, memberId);
        Expense expense = expenseRepository.findByIdAndTripId(expenseId, tripId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EXPENSE_NOT_FOUND));
        // expense_share는 DB FK(on delete cascade)로 함께 삭제된다.
        expenseRepository.delete(expense);
    }

    public BudgetSummaryResponse summary(Long tripId, Long memberId) {
        TripResponse trip = assertTripReadable(tripId, memberId);
        List<Expense> expenses = expenseRepository.findAllByTripIdOrderBySpentOnAsc(tripId);
        long totalSpent = expenses.stream().mapToLong(Expense::getAmount).sum();
        List<CategorySpend> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory, Collectors.summingLong(Expense::getAmount)))
                .entrySet().stream()
                .map(e -> new CategorySpend(e.getKey(), e.getValue()))
                .toList();
        Long planned = trip.budget();
        Long remaining = planned == null ? null : planned - totalSpent;
        return new BudgetSummaryResponse(planned, totalSpent, remaining, byCategory);
    }

    /** amount를 참여자 수로 균등 분할하고, 나머지는 앞선 참여자부터 1원씩 배분해 합계를 정확히 맞춘다. */
    private List<ExpenseShare> splitEqually(
            Long tripId, Long expenseId, long amount, List<Long> participantIds) {
        int n = participantIds.size();
        long base = amount / n;
        long remainder = amount % n;
        List<ExpenseShare> shares = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            long share = base + (i < remainder ? 1 : 0);
            shares.add(ExpenseShare.builder()
                    .expenseId(expenseId)
                    .tripId(tripId)
                    .memberId(participantIds.get(i))
                    .shareAmount(share)
                    .build());
        }
        return shares;
    }

    private ExpenseResponse toResponse(Expense expense, List<ExpenseShare> shares) {
        List<ShareResponse> shareResponses = shares.stream()
                .map(s -> new ShareResponse(s.getMemberId(), s.getShareAmount()))
                .toList();
        return new ExpenseResponse(
                expense.getId(),
                expense.getTripId(),
                expense.getPayerId(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDescription(),
                expense.getSpentOn(),
                shareResponses);
    }

    private TripResponse assertTripOwner(Long tripId, Long memberId) {
        TripResponse trip = tripService.getReadable(tripId, memberId);
        if (!trip.ownerId().equals(memberId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return trip;
    }

    private TripResponse assertTripReadable(Long tripId, Long memberId) {
        return tripService.getReadable(tripId, memberId);
    }
}
