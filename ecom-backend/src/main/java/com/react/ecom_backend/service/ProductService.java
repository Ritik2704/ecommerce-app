//package com.react.ecom_backend.service;
//
//import com.react.ecom_backend.model.Category;
//import com.react.ecom_backend.model.Product;
//import com.react.ecom_backend.repository.CategoryRepository;
//import com.react.ecom_backend.repository.ProductRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class ProductService {
//    @Autowired private ProductRepository productRepository;
//    @Autowired private CategoryRepository categoryRepository;
//
//    public List<Product> getProductsByCategory(String categoryName) {
//        Category category = categoryRepository.findByNameIgnoreCase(categoryName);
//        if (category == null) return List.of();
//        return productRepository.findByCategory(category);
//    }
//
//    public List<Product> getAllProducts() {
//        return productRepository.findAll();
//    }
//
//    public Product getProductById(Long id) {
//        return productRepository.findById(id).orElse(null);
//    }
//
//    public Product saveProduct(Product product) {
//        Category existingCategory = categoryRepository.findByNameIgnoreCase(product.getCategory().getName());
//        if (existingCategory != null) {
//            product.setCategory(existingCategory);
//        }
//        return productRepository.save(product);
//    }
//
//    public List<Category> getAllCategories() {
//        return categoryRepository.findAll();
//    }
//
//    public Page<Product> getPaginatedProducts(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return productRepository.findAll(pageable);
//    }
//
//    public Page<Product> getPaginatedProductsByCategory(String category, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return productRepository.findByCategoryName(category, pageable);
//    }
//
//}
//


package com.react.ecom_backend.service;

import com.react.ecom_backend.dto.ProductDTO;
import com.react.ecom_backend.model.Category;
import com.react.ecom_backend.repository.CategoryRepository;
import com.react.ecom_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAllProducts();
    }

    public ProductDTO getProductById(Long id) {
        return productRepository.findByProductId(id);
    }

    public List<ProductDTO> getProductsByCategory(String categoryName) {
        return productRepository.findByCategoryName(categoryName);
    }

    public Page<ProductDTO> getPaginatedProducts(int page, int size) {
        return productRepository.getPaginatedProducts(PageRequest.of(page, size));
    }

    public Page<ProductDTO> getPaginatedProductsByCategory(String category, int page, int size) {
        return productRepository.getPaginatedProductsByCategory(category, PageRequest.of(page, size));
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

}
