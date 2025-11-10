package com.market.service;

import com.market.dto.payment.PaymentRequest;
import com.market.dto.payment.PaymentResponse;
import com.market.entity.OrderStatus;

public interface PaymentService {
    String getSerectKey();

    PaymentResponse processPayment(PaymentRequest request);

    void updatePayment(String txnRef, OrderStatus status);

    void updatePayment(Long id, OrderStatus status);
}