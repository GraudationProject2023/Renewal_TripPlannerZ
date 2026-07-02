package com.tripplannerz.domain.chat;

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

class ChatIntegrationTest extends IntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    private void signup(String email, String nickname) throws Exception {
        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", email, "password", "password123", "nickname", nickname))))
                .andExpect(status().isCreated());
    }

    private String login(String email) throws Exception {
        String res = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", email, "password", "password123"))))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(res).path("data").path("accessToken").asText();
    }

    private long dataId(String body) throws Exception {
        return objectMapper.readTree(body).path("data").path("id").asLong();
    }

    @Test
    @DisplayName("동행 생성→방 개설, 비참여자 403, 수락 후 합류→메시지 송수신")
    void chat_membership_and_messaging() throws Exception {
        signup("chost@itest.com", "채팅호스트");
        signup("capplicant@itest.com", "채팅지원자");
        String hostToken = login("chost@itest.com");
        String applicantToken = login("capplicant@itest.com");

        // 동행 생성 → 채팅방 자동 개설(호스트 참여)
        long companionId = dataId(mockMvc.perform(post("/api/v1/companions")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "title", "제주 동행",
                                "destination", "제주",
                                "startDate", "2026-11-01",
                                "endDate", "2026-11-03",
                                "capacity", 2))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());

        String rooms = mockMvc.perform(get("/api/v1/chat/rooms")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].companionId").value((int) companionId))
                .andReturn()
                .getResponse()
                .getContentAsString();
        long roomId = objectMapper.readTree(rooms).path("data").get(0).path("roomId").asLong();

        // 비참여자(지원자)는 이력 조회 403
        mockMvc.perform(get("/api/v1/chat/rooms/" + roomId + "/messages")
                        .header("Authorization", "Bearer " + applicantToken))
                .andExpect(status().isForbidden());

        // 지원 → 수락 → 지원자 방 합류
        long applicationId = dataId(mockMvc.perform(
                        post("/api/v1/companions/" + companionId + "/applications")
                                .header("Authorization", "Bearer " + applicantToken)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json(Map.of("message", "같이가요"))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());
        mockMvc.perform(patch("/api/v1/companions/" + companionId + "/applications/"
                        + applicationId + "/accept")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk());

        // 양측 메시지 전송
        mockMvc.perform(post("/api/v1/chat/rooms/" + roomId + "/messages")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("content", "안녕하세요"))))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/v1/chat/rooms/" + roomId + "/messages")
                        .header("Authorization", "Bearer " + applicantToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("content", "반가워요"))))
                .andExpect(status().isCreated());

        // 이력 조회(최신순) — 2건, 최신이 "반가워요"
        mockMvc.perform(get("/api/v1/chat/rooms/" + roomId + "/messages")
                        .header("Authorization", "Bearer " + hostToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content.length()").value(2))
                .andExpect(jsonPath("$.data.content[0].content").value("반가워요"));
    }
}
