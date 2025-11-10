package com.market.service;

import com.market.dto.admin.DashboardResponse;
import com.market.dto.common.PagedResponse;
import com.market.dto.order.CreateOrderRequest;
import com.market.dto.order.OrderDetailResponse;
import com.market.dto.order.OrderResponse;
import com.market.dto.order.UpdateOrderStatusRequest;
import com.market.entity.OrderStatus;

import java.time.LocalDateTime;


public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request, String userEmail);

    PagedResponse<OrderResponse> getUserOrders(String userEmail, int page, int size);

    OrderDetailResponse getOrderById(Long orderId, String userEmail);

    void cancelOrder(Long orderId, String userEmail);

    PagedResponse<OrderResponse> getAllOrders(int page, int size, OrderStatus status,
                                              LocalDateTime startDate, LocalDateTime endDate);

    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);

    DashboardResponse getDashboardMetrics();
}