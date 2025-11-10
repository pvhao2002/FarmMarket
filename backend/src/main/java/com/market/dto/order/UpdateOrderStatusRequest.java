package com.market.dto.order;

import com.market.entity.OrderStatus;
import com.market.validation.ValidOrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderStatusRequest {
    
    @NotNull(message = "Order status is required")
    @ValidOrderStatus
    private OrderStatus status;
    
    private String notes;
}