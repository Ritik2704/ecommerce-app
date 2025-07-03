//package com.react.ecom_backend.repository;
//
//import com.react.ecom_backend.model.OrderItem;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}


package com.react.ecom_backend.repository;

import com.react.ecom_backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query(value = "SELECT * FROM order_items WHERE order_id = :orderId", nativeQuery = true)
    List<OrderItem> findByOrderId(Long orderId);
}
