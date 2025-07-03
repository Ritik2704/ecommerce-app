//package com.react.ecom_backend.service;
//
//import com.react.ecom_backend.model.CartItem;
//import com.react.ecom_backend.model.Product;
//import com.react.ecom_backend.model.User;
//import com.react.ecom_backend.repository.CartItemRepository;
//import com.react.ecom_backend.repository.ProductRepository;
//import com.react.ecom_backend.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//public class CartService {
//
//    @Autowired private UserRepository userRepository;
//    @Autowired private ProductRepository productRepository;
//    @Autowired private CartItemRepository cartItemRepository;
//
//    public CartItem addToCart(String username, Long productId, int quantity) {
//        User user = userRepository.findByEmail(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Product product = productRepository.findById(productId)
//                .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
//                .orElse(new CartItem());
//
//        cartItem.setUser(user);
//        cartItem.setProduct(product);
//        cartItem.setQuantity(cartItem.getId() == null ? quantity : cartItem.getQuantity() + quantity);
//
//        return cartItemRepository.save(cartItem);
//    }
//
//    public CartItem decreaseQuantity(String username, Long cartItemId) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        CartItem item = cartItemRepository.findById(cartItemId)
//                .orElseThrow(() -> new RuntimeException("Cart item not found"));
//
//        if (!item.getUser().equals(user)) {
//            throw new RuntimeException("Unauthorized access to cart item");
//        }
//
//        if (item.getQuantity() > 1) {
//            item.setQuantity(item.getQuantity() - 1);
//            return cartItemRepository.save(item);
//        } else {
//            cartItemRepository.delete(item);
//            return null;
//        }
//    }
//
//    public List<CartItem> getCartItems(String email) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
//        return cartItemRepository.findByUser(user);
//    }
//
//    @Transactional
//    public void clearCart(String username) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        cartItemRepository.deleteByUser(user);
//    }
//}


package com.react.ecom_backend.service;

import com.react.ecom_backend.dto.CartItemDto;
import com.react.ecom_backend.model.CartItem;
import com.react.ecom_backend.model.Product;
import com.react.ecom_backend.model.User;
import com.react.ecom_backend.repository.CartItemRepository;
import com.react.ecom_backend.repository.ProductRepository;
import com.react.ecom_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CartItemRepository cartItemRepository;

//    public CartItem addToCart(String username, Long productId, int quantity) {
//        User user = userRepository.findByEmail(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Product product = productRepository.findProductByIdNative(productId)
//                .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        CartItem cartItem = cartItemRepository
//                .findByUserIdAndProductId(user.getId(), product.getId())
//                .orElse(new CartItem());
//
//        cartItem.setUserId(user.getId());
//        cartItem.setProductId(product.getId());
//        cartItem.setQuantity(cartItem.getId() == null ? quantity : cartItem.getQuantity() + quantity);
//
//        return cartItemRepository.save(cartItem);
//    }

    public CartItem addToCart(String username, Long productId, int quantity) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findProductByIdNative(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository
                .findByUserIdAndProductId(user.getId(), product.getId())
                .orElse(new CartItem());

        cartItem.setUserId(user.getId());
        cartItem.setProductId(product.getId());
        cartItem.setProductName(product.getName());
        cartItem.setProductPrice(product.getPrice());
        cartItem.setQuantity(cartItem.getId() == null ? quantity : cartItem.getQuantity() + quantity);

        return cartItemRepository.save(cartItem);
    }


    public CartItem decreaseQuantity(String username, Long cartItemId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
            return cartItemRepository.save(item);
        } else {
            cartItemRepository.delete(item);
            return null;
        }
    }

    public List<CartItemDto> getCartItems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return cartItemRepository.findCartItemsWithProductByUserId(user.getId());
    }

    @Transactional
    public void clearCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartItemRepository.deleteByUserId(user.getId());
    }
}
