package com.react.ecom_backend.repository;

import com.react.ecom_backend.dto.CartItemDto;
import com.react.ecom_backend.model.CartItem;
import com.react.ecom_backend.model.Product;
import com.react.ecom_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
//    List<CartItem> findByUser(User user);
//    Optional<CartItem> findByUserAndProduct(User user, Product product);
//    void deleteByUser(User user);


    @Query(value = "SELECT * FROM cart_items WHERE user_id = :userId", nativeQuery = true)
    List<CartItem> findByUserId(Long userId);

    @Query(value = "SELECT * FROM cart_items WHERE user_id = :userId AND product_id = :productId", nativeQuery = true)
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    @Query(value = "DELETE FROM cart_items WHERE user_id = :userId", nativeQuery = true)
    @Modifying
    void deleteByUserId(Long userId);

    @Query(value = """
    SELECT 
        ci.id AS id,
        ci.quantity AS quantity,
        ci.product_id AS productId,
        ci.product_name AS productName,
        ci.product_price AS productPrice,
        p.image_url AS productImageUrl
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = :userId
    """, nativeQuery = true)
    List<CartItemDto> findCartItemsWithProductByUserId(Long userId);

}
