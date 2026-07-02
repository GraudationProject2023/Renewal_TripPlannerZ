package com.tripplannerz.domain.budget.dto;

import java.util.List;

/** 정산 결과. balances는 멤버별 지불/분담/잔액, transfers는 최소 송금 제안(누가 누구에게 얼마). */
public record SettlementResponse(
        List<MemberBalance> balances,
        List<Transfer> transfers) {

    /** net = paid - owed. 양수면 받을 돈, 음수면 낼 돈. */
    public record MemberBalance(Long memberId, long paid, long owed, long net) {
    }

    public record Transfer(Long fromMemberId, Long toMemberId, long amount) {
    }
}
