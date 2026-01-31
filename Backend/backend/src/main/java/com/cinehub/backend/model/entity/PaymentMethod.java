package com.cinehub.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PaymentMethod {
    MOMO,
    ZALOPAY;
    @JsonCreator 
    public static PaymentMethod fromString(String value) { 
        return PaymentMethod.valueOf(value.toUpperCase()); 
    }
}