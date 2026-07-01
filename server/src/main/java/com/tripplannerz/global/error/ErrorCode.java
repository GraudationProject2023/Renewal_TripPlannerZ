package com.tripplannerz.global.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 모든 비즈니스 에러의 중앙 정의. {@code code} 문자열은 프론트(@ui)와의 계약이다.
 * 새 도메인 에러는 도메인 접두어로 이어서 추가한다.
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // --- Common ---
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "INVALID_INPUT", "요청 값이 올바르지 않습니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN", "접근 권한이 없습니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "NOT_FOUND", "리소스를 찾을 수 없습니다."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "서버 오류가 발생했습니다."),

    // --- Member / Auth ---
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MEMBER_NOT_FOUND", "회원을 찾을 수 없습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "유효하지 않은 토큰입니다."),

    // --- Trip ---
    TRIP_NOT_FOUND(HttpStatus.NOT_FOUND, "TRIP_NOT_FOUND", "여행 일정을 찾을 수 없습니다."),

    // --- Companion ---
    COMPANION_NOT_FOUND(HttpStatus.NOT_FOUND, "COMPANION_NOT_FOUND", "동행 모집글을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
