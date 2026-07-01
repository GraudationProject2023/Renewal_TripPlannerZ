package com.tripplannerz.global.common;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 모든 API 응답을 감싸는 표준 래퍼.
 * 성공: {@code { success: true, data: ..., error: null }}
 * 실패: {@code { success: false, data: null, error: { code, message } }}
 */
@JsonInclude(JsonInclude.Include.ALWAYS)
public record ApiResponse<T>(boolean success, T data, ApiError error) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static ApiResponse<Void> success() {
        return new ApiResponse<>(true, null, null);
    }

    public static ApiResponse<Void> error(ApiError error) {
        return new ApiResponse<>(false, null, error);
    }

    /** 표준 에러 바디. {@code code}는 프론트와의 계약 문자열이다. */
    public record ApiError(String code, String message) {
    }
}
