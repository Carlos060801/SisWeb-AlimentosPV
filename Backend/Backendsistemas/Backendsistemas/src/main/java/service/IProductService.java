package service;

import java.util.List;

import dto.request.ProductRequest;
import dto.response.ProductResponse;

public interface IProductService {

    ProductResponse create(ProductRequest productRequest);
    ProductResponse update(Long id, ProductRequest productRequest);
    void delete(Long id);
    ProductResponse findById(Long id);
    List<ProductResponse> findAll();
    
}
