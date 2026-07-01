package com.tripplannerz.global.error;

import com.tripplannerz.global.common.ApiResponse;
import com.tripplannerz.global.common.ApiResponse.ApiError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 모든 예외를 표준 에러 응답({@link ApiResponse})으로 변환하는 단일 진입점.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusiness(BusinessException e) {
        ErrorCode code = e.getErrorCode();
        log.warn("business exception: {} - {}", code.getCode(), e.getMessage());
        return ResponseEntity.status(code.getStatus())
                .body(ApiResponse.error(new ApiError(code.getCode(), e.getMessage())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        ErrorCode code = ErrorCode.INVALID_INPUT;
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .orElse(code.getMessage());
        return ResponseEntity.status(code.getStatus())
                .body(ApiResponse.error(new ApiError(code.getCode(), message)));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception e) {
        ErrorCode code = ErrorCode.INTERNAL_ERROR;
        log.error("unexpected exception", e);
        return ResponseEntity.status(code.getStatus())
                .body(ApiResponse.error(new ApiError(code.getCode(), code.getMessage())));
    }
}
