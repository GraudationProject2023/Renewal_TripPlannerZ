package com.tripplannerz.domain.member.entity;

/** 회원 권한. Spring Security 권한 문자열은 {@code ROLE_} 접두어로 매핑된다. */
public enum Role {
    USER,
    ADMIN,
}
