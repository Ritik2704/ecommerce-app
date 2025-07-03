//package com.react.ecom_backend.service;
//
//import com.react.ecom_backend.model.*;
//import com.react.ecom_backend.repository.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.*;
//
//@Service
//public class OrderService {
//
//    @Autowired private UserRepository userRepository;
//    @Autowired private CartItemRepository cartItemRepository;
//    @Autowired private OrderRepository orderRepository;
//    @Autowired private OrderItemRepository orderItemRepository;
//
//    @Transactional
//    public Order placeOrder(String email) {
//        User user = userRepository.findByEmail(email).orElseThrow();
//
//        List<CartItem> cartItems = cartItemRepository.findByUser(user);
//        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");
//
//        Order order = new Order();
//        order.setUser(user);
//        order.setCreatedAt(LocalDateTime.now());
//
//        Order savedOrder = orderRepository.save(order);
//
//        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
//            OrderItem item = new OrderItem();
//            item.setProductName(cartItem.getProduct().getName());
//            item.setProductPrice(cartItem.getProduct().getPrice());
//            item.setQuantity(cartItem.getQuantity());
//            item.setOrder(savedOrder);
//            return item;
//        }).toList();
//
//        // Save all order items
//        orderItemRepository.saveAll(orderItems);
//
//        // Attach saved items to the order
//        savedOrder.setItems(orderItems);
//
//        // Clear the cart
//        cartItemRepository.deleteByUser(user);
//
//        return savedOrder;
//    }
//
//    public List<Order> getOrders(String username) {
//        User user = userRepository.findByUsername(username).orElseThrow();
//        return orderRepository.findByUser(user);
//    }
//}


package com.react.ecom_backend.service;

import com.react.ecom_backend.model.*;
import com.react.ecom_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired private UserRepository userRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ProductRepository productRepository;

    @Transactional
    public Order placeOrder(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Long userId = user.getId();

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        Order order = new Order();
        order.setUserId(userId);
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            Product product = productRepository.findProductByIdNative(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + cartItem.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrderId(savedOrder.getId());
            item.setProductName(product.getName());
            item.setProductPrice(product.getPrice());
            item.setQuantity(cartItem.getQuantity());
            return item;
        }).toList();

        orderItemRepository.saveAll(orderItems);
        savedOrder.setItems(orderItems);

        cartItemRepository.deleteByUserId(userId);

        return savedOrder;
    }

    public List<Order> getOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }
}
