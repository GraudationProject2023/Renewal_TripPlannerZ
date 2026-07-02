package com.tripplannerz.domain.member.controller;

import com.tripplannerz.domain.member.dto.MemberResponse;
import com.tripplannerz.domain.member.dto.SignUpRequest;
import com.tripplannerz.domain.member.service.MemberService;
import com.tripplannerz.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MemberResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        return ApiResponse.onSuccess(memberService.signUp(request));
    }

    @GetMapping("/me")
    public ApiResponse<MemberResponse> getMyProfile(@AuthenticationPrincipal Long memberId) {
        return ApiResponse.onSuccess(memberService.getById(memberId));
    }

    @GetMapping("/{id}")
    public ApiResponse<MemberResponse> getMember(@PathVariable Long id) {
        return ApiResponse.onSuccess(memberService.getById(id));
    }
}
