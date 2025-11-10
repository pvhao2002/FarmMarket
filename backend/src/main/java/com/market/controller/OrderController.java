package com.market.controller;

import com.market.dto.common.MessageResponse;
import com.market.dto.order.CreateOrderRequest;
import com.market.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    
    private final OrderService orderService;

    @PostMapping
    public Object createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request, authentication.getName()));
    }

    @GetMapping("/my-orders")
    public Object getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(orderService.getUserOrders(
                authentication.getName(), page, size));
    }
    
    @GetMapping("/{id}")
    public Object getOrderById(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrderById(id, authentication.getName()));
    }

    @PostMapping("/{id}/cancel")
    public Object cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {
        orderService.cancelOrder(id, authentication.getName());
        return ResponseEntity.ok(MessageResponse.of("Order cancelled successfully"));
    }
}