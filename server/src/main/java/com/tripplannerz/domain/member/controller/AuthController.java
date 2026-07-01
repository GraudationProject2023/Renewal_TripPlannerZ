package com.tripplannerz.domain.member.controller;

import com.tripplannerz.domain.member.dto.LoginRequest;
import com.tripplannerz.domain.member.dto.TokenRefreshRequest;
import com.tripplannerz.domain.member.dto.TokenResponse;
import com.tripplannerz.domain.member.service.AuthService;
import com.tripplannerz.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @PostMapping("/reissue")
    public ApiResponse<TokenResponse> reissue(@Valid @RequestBody TokenRefreshRequest request) {
        return ApiResponse.success(authService.reissue(request.refreshToken()));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> logout(@AuthenticationPrincipal Long memberId) {
        authService.logout(memberId);
        return ApiResponse.success();
    }
}
