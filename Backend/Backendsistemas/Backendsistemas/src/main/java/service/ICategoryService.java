package service;

import java.util.List;

import dto.request.CategoryRequest;
import dto.response.CategoryResponse;

public interface ICategoryService {

    CategoryResponse create(CategoryRequest categoryRequest);
    CategoryResponse update(Long id, CategoryRequest categoryRequest);
    void delete(Long id);
    CategoryResponse findById(Long id);
    List<CategoryResponse> findAll();
    
}
