package com.tripplannerz.global.common;

import java.util.List;
import org.springframework.data.domain.Page;

/**
 * 페이지네이션 응답 통일 포맷. Spring Data {@link Page}를 그대로 노출하지 않는다.
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last) {

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast());
    }
}
