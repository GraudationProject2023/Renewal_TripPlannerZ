package com.tripplannerz.domain.budget.service;

import com.tripplannerz.domain.budget.dto.SettlementResponse;
import com.tripplannerz.domain.budget.dto.SettlementResponse.MemberBalance;
import com.tripplannerz.domain.budget.dto.SettlementResponse.Transfer;
import com.tripplannerz.domain.budget.entity.Expense;
import com.tripplannerz.domain.budget.entity.ExpenseShare;
import com.tripplannerz.domain.budget.repository.ExpenseRepository;
import com.tripplannerz.domain.budget.repository.ExpenseShareRepository;
import com.tripplannerz.domain.trip.service.TripService;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SettlementService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseShareRepository expenseShareRepository;
    private final TripService tripService;

    public SettlementResponse settle(Long tripId, Long memberId) {
        tripService.getReadable(tripId, memberId); // 조회 권한 검증(비공개 타인 접근 시 예외)

        Map<Long, Long> paidByMember =
                expenseRepository.findAllByTripIdOrderBySpentOnAsc(tripId).stream()
                        .collect(Collectors.groupingBy(
                                Expense::getPayerId, Collectors.summingLong(Expense::getAmount)));
        Map<Long, Long> owedByMember =
                expenseShareRepository.findAllByTripId(tripId).stream()
                        .collect(Collectors.groupingBy(
                                ExpenseShare::getMemberId,
                                Collectors.summingLong(ExpenseShare::getShareAmount)));

        TreeSet<Long> members = new TreeSet<>();
        members.addAll(paidByMember.keySet());
        members.addAll(owedByMember.keySet());

        List<MemberBalance> balances = new ArrayList<>();
        for (Long member : members) {
            long paid = paidByMember.getOrDefault(member, 0L);
            long owed = owedByMember.getOrDefault(member, 0L);
            balances.add(new MemberBalance(member, paid, owed, paid - owed));
        }

        return new SettlementResponse(balances, computeTransfers(balances));
    }

    /** 채무자/채권자를 그리디로 매칭해 최소 횟수에 가까운 송금 목록을 만든다. (지출은 항상 전액 분할되어 합계는 0) */
    private List<Transfer> computeTransfers(List<MemberBalance> balances) {
        Deque<long[]> debtors = new ArrayDeque<>();
        Deque<long[]> creditors = new ArrayDeque<>();
        for (MemberBalance balance : balances) {
            if (balance.net() < 0) {
                debtors.add(new long[] {balance.memberId(), -balance.net()});
            } else if (balance.net() > 0) {
                creditors.add(new long[] {balance.memberId(), balance.net()});
            }
        }

        List<Transfer> transfers = new ArrayList<>();
        while (!debtors.isEmpty() && !creditors.isEmpty()) {
            long[] debtor = debtors.peek();
            long[] creditor = creditors.peek();
            long pay = Math.min(debtor[1], creditor[1]);
            transfers.add(new Transfer(debtor[0], creditor[0], pay));
            debtor[1] -= pay;
            creditor[1] -= pay;
            if (debtor[1] == 0) {
                debtors.poll();
            }
            if (creditor[1] == 0) {
                creditors.poll();
            }
        }
        return transfers;
    }
}
