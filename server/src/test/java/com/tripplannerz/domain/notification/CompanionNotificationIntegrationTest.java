package com.tripplannerz.domain.notification;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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

class CompanionNotificationIntegrationTest extends IntegrationTest {

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

    private long dataId(String responseBody) throws Exception {
        return objectMapper.readTree(responseBody).path("data").path("id").asLong();
    }

    @Test
    @DisplayName("동행 지원 → 호스트 알림 생성, 수락 → 지원자 알림 생성")
    void application_creates_notifications() throws Exception {
        signup("nhost@itest.com", "호스트");
        signup("napplicant@itest.com", "지원자");
        String hostToken = login("nhost@itest.com");
        String applicantToken = login("napplicant@itest.com");

        // 호스트가 모집글 생성
        Map<String, Object> companion = Map.of(
                "title", "부산 동행",
                "destination", "부산",
                "startDate", "2026-10-01",
                "endDate", "2026-10-03",
                "capacity", 2);
        long companionId = dataId(mockMvc.perform(post("/api/v1/companions")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(companion)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());

        // 지원자가 지원 → 호스트에게 알림
        long applicationId = dataId(mockMvc.perform(
                        post("/api/v1/companions/" + companionId + "/applications")
                                .header("Authorization", "Bearer " + applicantToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json(Map.of("message", "같이 가요"))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());

        mockMvc.perform(get("/api/v1/notifications/unread-count")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.unreadCount").value(1));

        mockMvc.perform(get("/api/v1/notifications")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].type").value("COMPANION_APPLICATION_RECEIVED"))
                .andExpect(jsonPath("$.data.content[0].relatedId").value((int) companionId))
                .andExpect(jsonPath("$.data.content[0].read").value(false));

        // 호스트가 수락 → 지원자에게 알림
        mockMvc.perform(patch("/api/v1/companions/" + companionId + "/applications/"
                        + applicationId + "/accept")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/notifications")
                        .header("Authorization", "Bearer " + applicantToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].type").value("COMPANION_APPLICATION_ACCEPTED"));
    }
}
