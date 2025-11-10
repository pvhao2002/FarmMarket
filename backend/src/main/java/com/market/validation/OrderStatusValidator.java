package com.market.validation;

import com.market.entity.OrderStatus;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OrderStatusValidator implements ConstraintValidator<ValidOrderStatus, OrderStatus> {
    @Override
    public boolean isValid(OrderStatus orderStatus, ConstraintValidatorContext context) {
        if (orderStatus == null) {
            return false;
        }

        return orderStatus == OrderStatus.PENDING ||
                orderStatus == OrderStatus.PROCESSING ||
                orderStatus == OrderStatus.SHIPPED ||
                orderStatus == OrderStatus.DELIVERED ||
                orderStatus == OrderStatus.CANCELLED;
    }
}