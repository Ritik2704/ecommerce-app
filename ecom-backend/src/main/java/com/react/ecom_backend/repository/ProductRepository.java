package com.react.ecom_backend.repository;

import com.react.ecom_backend.dto.ProductDTO;
import com.react.ecom_backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends PagingAndSortingRepository<Product, Long> {

    @Query(value = "SELECT * FROM products WHERE id = :id", nativeQuery = true)
    Optional<Product> findProductByIdNative(@Param("id") Long id);


    @Query(value = """
        SELECT p.id, p.name, p.price, p.description, p.image_url AS imageUrl,
               c.id AS categoryId, c.name AS categoryName
        FROM products p
        JOIN categories c ON p.category_id = c.id
        """, nativeQuery = true)
    List<ProductDTO> findAllProducts();

    @Query(value = """
        SELECT p.id, p.name, p.price, p.description, p.image_url AS imageUrl,
               c.id AS categoryId, c.name AS categoryName
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE c.name = ?1
        """, nativeQuery = true)
    List<ProductDTO> findByCategoryName(String categoryName);

    @Query(value = """
        SELECT p.id, p.name, p.price, p.description, p.image_url AS imageUrl,
               c.id AS categoryId, c.name AS categoryName
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?1
        """, nativeQuery = true)
    ProductDTO findByProductId(Long id);

    @Query(value = """
        SELECT p.id, p.name, p.price, p.description, p.image_url AS imageUrl,
               c.id AS categoryId, c.name AS categoryName
        FROM products p
        JOIN categories c ON p.category_id = c.id
        """,
            countQuery = "SELECT COUNT(*) FROM products",
            nativeQuery = true)
    Page<ProductDTO> getPaginatedProducts(Pageable pageable);

    @Query(value = """
        SELECT p.id, p.name, p.price, p.description, p.image_url AS imageUrl,
               c.id AS categoryId, c.name AS categoryName
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE c.name = ?1
        """,
            countQuery = "SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id WHERE c.name = ?1",
            nativeQuery = true)
    Page<ProductDTO> getPaginatedProductsByCategory(String categoryName, Pageable pageable);
}

