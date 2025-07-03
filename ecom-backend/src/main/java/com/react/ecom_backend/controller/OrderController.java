package com.react.ecom_backend.controller;

import com.react.ecom_backend.dto.OrderItemDTO;
import com.react.ecom_backend.dto.OrderResponseDTO;
import com.react.ecom_backend.model.Order;
import com.react.ecom_backend.model.OrderItem;
import com.react.ecom_backend.repository.OrderItemRepository;
import com.react.ecom_backend.repository.OrderRepository;
import com.react.ecom_backend.repository.UserRepository;
import com.react.ecom_backend.security.JwtUtil;
import com.react.ecom_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;

    @PostMapping("/buy")
    public ResponseEntity<?> placeOrder(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
        }

        try {
            String token = authHeader.substring(7);
            String username = jwtUtil.getUsernameFromToken(token);
            Order order = orderService.placeOrder(username);

            List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());

            List<OrderItemDTO> items = orderItems.stream().map(item ->
                    new OrderItemDTO(item.getProductName(), item.getProductPrice(), item.getQuantity())
            ).collect(Collectors.toList());

            OrderResponseDTO responseDTO = new OrderResponseDTO(order.getId(), order.getCreatedAt(), items);

            return ResponseEntity.ok(responseDTO);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body("User not found");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to place order");
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getOrders(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.getUsernameFromToken(token);

        List<Order> orders = orderService.getOrders(email);

        List<OrderResponseDTO> response = orders.stream().map(order -> {
            List<OrderItemDTO> items = orderItemRepository.findByOrderId(order.getId()).stream()
                    .map(item -> new OrderItemDTO(item.getProductName(), item.getProductPrice(), item.getQuantity()))
                    .collect(Collectors.toList());

            return new OrderResponseDTO(order.getId(), order.getCreatedAt(), items);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
//        return ResponseEntity.status(500).build();
    }
}
