package com.tripplannerz.domain.member;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripplannerz.support.IntegrationTest;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

class MemberAuthIntegrationTest extends IntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    @Test
    @DisplayName("회원가입 → 로그인 → /me → 미인증 401 플로우")
    void signup_login_me_flow() throws Exception {
        Map<String, String> signup =
                Map.of("email", "flow@test.com", "password", "password123", "nickname", "여행자");
        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(signup)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("flow@test.com"))
                .andExpect(jsonPath("$.data.role").value("USER"));

        Map<String, String> login = Map.of("email", "flow@test.com", "password", "password123");
        String body = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode node = objectMapper.readTree(body);
        String accessToken = node.path("data").path("accessToken").asText();

        mockMvc.perform(get("/api/v1/members/me").header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.nickname").value("여행자"));

        mockMvc.perform(get("/api/v1/members/me")).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("이메일 중복 가입은 409(DUPLICATE_EMAIL)")
    void duplicate_email_returns_conflict() throws Exception {
        Map<String, String> signup =
                Map.of("email", "dup@test.com", "password", "password123", "nickname", "중복");
        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(signup)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(signup)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("DUPLICATE_EMAIL"));
    }

    @Test
    @DisplayName("잘못된 비밀번호 로그인은 401(INVALID_CREDENTIALS)")
    void wrong_password_returns_unauthorized() throws Exception {
        Map<String, String> signup =
                Map.of("email", "wrong@test.com", "password", "password123", "nickname", "비번");
        mockMvc.perform(post("/api/v1/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(signup)))
                .andExpect(status().isCreated());

        Map<String, String> login = Map.of("email", "wrong@test.com", "password", "wrongpassword");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error.code").value("INVALID_CREDENTIALS"));
    }
}
