package com.market.dto.payment;

import com.market.entity.PaymentMethod;
import com.market.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private String transactionId;
    private PaymentStatus status;
    private PaymentMethod paymentMethod;
    private BigDecimal amount;
    private String gatewayResponse;
    private String errorMessage;
    private LocalDateTime processedAt;
    private Long id;
    private Long orderId;
    private String gatewayTransactionId;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String paymentUrl; // For MoMo and VNPay redirects
    private String qrCode; // For QR code payments
}