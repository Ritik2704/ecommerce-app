package com.react.ecom_backend.dto;

public interface CartItemDto {
    Long getId();
    Integer getQuantity();
    Long getProductId();
    String getProductName();
    Double getProductPrice();
    String getProductImageUrl();
}
