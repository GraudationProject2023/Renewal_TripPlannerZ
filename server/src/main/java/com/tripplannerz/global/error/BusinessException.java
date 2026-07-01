package com.tripplannerz.global.error;

import lombok.Getter;

/**
 * 모든 비즈니스 예외의 단일 타입. {@link ErrorCode}로 상태·코드·메시지를 결정한다.
 */
@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
