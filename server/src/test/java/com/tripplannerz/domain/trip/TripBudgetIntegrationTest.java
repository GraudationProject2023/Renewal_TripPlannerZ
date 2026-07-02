package com.tripplannerz.domain.trip;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripplannerz.support.IntegrationTest;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

class TripBudgetIntegrationTest extends IntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    private long signup(String email, String nickname) throws Exception {
        Map<String, String> body =
                Map.of("email", email, "password", "password123", "nickname", nickname);
        String res = mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(body)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(res).path("data").path("id").asLong();
    }

    private String login(String email) throws Exception {
        Map<String, String> body = Map.of("email", email, "password", "password123");
        String res = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(body)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(res).path("data").path("accessToken").asText();
    }

    private long createTrip(String token) throws Exception {
        Map<String, Object> body = Map.of(
                "title", "제주 3박4일",
                "destination", "제주",
                "startDate", "2026-08-01",
                "endDate", "2026-08-04",
                "budget", 500000,
                "visibility", "PRIVATE");
        String res = mockMvc.perform(post("/api/v1/trips")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(body)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(res).path("data").path("id").asLong();
    }

    private long addItem(String token, long tripId, int day, int order, String place) throws Exception {
        Map<String, Object> body = Map.of(
                "dayNumber", day,
                "sortOrder", order,
                "placeName", place,
                "estimatedCost", 10000,
                "stayMinutes", 90);
        String res = mockMvc.perform(post("/api/v1/trips/" + tripId + "/items")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(body)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(res).path("data").path("id").asLong();
    }

    @Test
    @DisplayName("여행 생성 → 장소 2개 추가 → 재정렬 → 목록 조회")
    void trip_items_and_reorder() throws Exception {
        String token = login(signupUnique("trip-owner"));
        long tripId = createTrip(token);
        long item1 = addItem(token, tripId, 1, 0, "성산일출봉");
        long item2 = addItem(token, tripId, 1, 1, "우도");

        Map<String, Object> reorder = Map.of("orders", List.of(
                Map.of("itemId", item1, "dayNumber", 1, "sortOrder", 1),
                Map.of("itemId", item2, "dayNumber", 1, "sortOrder", 0)));
        mockMvc.perform(put("/api/v1/trips/" + tripId + "/items/reorder")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(reorder)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/trips/" + tripId + "/items")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                // 재정렬 후 sortOrder=0인 우도가 먼저 온다
                .andExpect(jsonPath("$.data[0].placeName").value("우도"));
    }

    @Test
    @DisplayName("지출 N빵 → 정산: 잔액과 최소 송금 계산")
    void expense_split_and_settlement() throws Exception {
        long hostId = signup("host@settle.com", "호스트");
        long friendId = signup("friend@settle.com", "친구");
        String hostToken = login("host@settle.com");
        long tripId = createTrip(hostToken);

        Map<String, Object> expense = Map.of(
                "payerId", hostId,
                "amount", 10000,
                "category", "FOOD",
                "description", "저녁",
                "spentOn", "2026-08-01",
                "participantIds", List.of(hostId, friendId));
        mockMvc.perform(post("/api/v1/trips/" + tripId + "/expenses")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(expense)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.shares.length()").value(2));

        // 호스트가 10000 지불, 각자 5000 분담 → 호스트 net +5000, 친구 net -5000
        mockMvc.perform(get("/api/v1/trips/" + tripId + "/settlement")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.balances.length()").value(2))
                .andExpect(jsonPath("$.data.transfers.length()").value(1))
                .andExpect(jsonPath("$.data.transfers[0].fromMemberId").value((int) friendId))
                .andExpect(jsonPath("$.data.transfers[0].toMemberId").value((int) hostId))
                .andExpect(jsonPath("$.data.transfers[0].amount").value(5000));

        // 예산 요약: 계획 500000, 지출 10000, 잔여 490000
        mockMvc.perform(get("/api/v1/trips/" + tripId + "/budget")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalSpent").value(10000))
                .andExpect(jsonPath("$.data.remaining").value(490000));
    }

    private String signupUnique(String nickname) throws Exception {
        String email = nickname + "@itest.com";
        signup(email, nickname);
        return email;
    }
}
