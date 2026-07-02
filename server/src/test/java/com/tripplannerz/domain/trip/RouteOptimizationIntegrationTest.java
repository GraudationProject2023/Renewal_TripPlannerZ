package com.tripplannerz.domain.trip;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripplannerz.support.IntegrationTest;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

class RouteOptimizationIntegrationTest extends IntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    private String setUpOwnerToken() throws Exception {
        Map<String, String> signup =
                Map.of("email", "route@itest.com", "password", "password123", "nickname", "경로");
        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(signup)))
                .andExpect(status().isCreated());
        Map<String, String> login = Map.of("email", "route@itest.com", "password", "password123");
        String res = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(login)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(res).path("data").path("accessToken").asText();
    }

    private long createTrip(String token) throws Exception {
        Map<String, Object> body = Map.of(
                "title", "동선 최적화",
                "destination", "서울",
                "startDate", "2026-09-01",
                "endDate", "2026-09-02",
                "budget", 300000,
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

    private void addItem(String token, long tripId, int order, String place, double lat, double lng)
            throws Exception {
        Map<String, Object> body = Map.of(
                "dayNumber", 1,
                "sortOrder", order,
                "placeName", place,
                "latitude", lat,
                "longitude", lng);
        mockMvc.perform(post("/api/v1/trips/" + tripId + "/items")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(body)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("경로 최적화 적용 → 방문 순서(sort_order) 재배치")
    void apply_optimize_reorders_items() throws Exception {
        String token = setUpOwnerToken();
        long tripId = createTrip(token);

        // 입력 순서(A, C, B) — 최근접이웃 최적화 시 A → B → C 여야 한다.
        addItem(token, tripId, 0, "A", 0.0, 0.0);
        addItem(token, tripId, 1, "C", 0.0, 5.0);
        addItem(token, tripId, 2, "B", 0.0, 1.0);

        mockMvc.perform(post("/api/v1/trips/" + tripId + "/route/optimize")
                        .header("Authorization", "Bearer " + token)
                        .param("day", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.stops.length()").value(3))
                .andExpect(jsonPath("$.data.stops[0].placeName").value("A"))
                .andExpect(jsonPath("$.data.stops[1].placeName").value("B"))
                .andExpect(jsonPath("$.data.stops[2].placeName").value("C"));

        // 저장된 순서 확인: A, B, C
        mockMvc.perform(get("/api/v1/trips/" + tripId + "/items")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].placeName").value("A"))
                .andExpect(jsonPath("$.data[1].placeName").value("B"))
                .andExpect(jsonPath("$.data[2].placeName").value("C"));
    }
}
