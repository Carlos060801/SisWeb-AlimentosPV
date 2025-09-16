package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Product;

public interface IProductRepository extends JpaRepository<Product, Long> {
    
}
