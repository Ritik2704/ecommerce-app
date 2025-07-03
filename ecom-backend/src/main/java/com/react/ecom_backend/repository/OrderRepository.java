//package com.react.ecom_backend.repository;
//
//import com.react.ecom_backend.model.Order;
//import com.react.ecom_backend.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface OrderRepository extends JpaRepository<Order, Long> {
//    List<Order> findByUser(User user);
//}

package com.react.ecom_backend.repository;

import com.react.ecom_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(value = "SELECT * FROM orders WHERE user_id = :userId", nativeQuery = true)
    List<Order> findByUserId(Long userId);
}

