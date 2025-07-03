package com.react.ecom_backend.controller;

import com.react.ecom_backend.dto.CartItemDto;
import com.react.ecom_backend.dto.CartRequest;
import com.react.ecom_backend.model.CartItem;
import com.react.ecom_backend.repository.CartItemRepository;
import com.react.ecom_backend.repository.UserRepository;
import com.react.ecom_backend.service.CartService;
import com.react.ecom_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired private CartService cartService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private CartItemRepository cartItemRepository;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CartRequest request, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(
                cartService.addToCart(username, request.getProductId(), request.getQuantity())
        );
    }

//    @GetMapping
//    public ResponseEntity<List<CartItemDto>> getCart(@RequestHeader("Authorization") String authHeader) {
//        String token = authHeader.substring(7);
//        String email = jwtUtil.getUsernameFromToken(token);
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        List<CartItem> cartItems = cartItemRepository.findByUser(user);
//
//        List<CartItemDto> response = cartItems.stream()
//                .map(item -> new CartItemDto(
//                        item.getId(),
//                        item.getQuantity(),
//                        item.getProduct()
//                ))
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(response);
//    }


    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.getUsernameFromToken(token);

        List<CartItemDto> cartItems = cartService.getCartItems(email);
        return ResponseEntity.ok(cartItems);
//        return ResponseEntity.status(500).build();
    }



    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        String username = authentication.getName();
        cartService.clearCart(username);
        return ResponseEntity.ok("Cart cleared");
    }

    @PutMapping("/decrease/{id}")
    public ResponseEntity<?> decreaseQuantity(@PathVariable Long id, Authentication auth) {
        String username = auth.getName();
        CartItem updated = cartService.decreaseQuantity(username, id);
        return ResponseEntity.ok(updated);
    }


}