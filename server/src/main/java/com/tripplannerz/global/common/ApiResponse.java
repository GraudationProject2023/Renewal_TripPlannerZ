package com.tripplannerz.global.common;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.ALWAYS)
public record ApiResponse<T>(boolean success, T data, ApiError error) {

    public static <T> ApiResponse<T> onSuccess(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static ApiResponse<Void> onSuccessEmpty() {
        return new ApiResponse<>(true, null, null);
    }

    public static ApiResponse<Void> onFailure(ApiError error) {
        return new ApiResponse<>(false, null, error);
    }

    public record ApiError(String code, String message) {
    }
}
