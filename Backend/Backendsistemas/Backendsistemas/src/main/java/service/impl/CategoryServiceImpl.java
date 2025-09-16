package service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dto.request.CategoryRequest;
import dto.response.CategoryResponse;
import entity.Category;
import lombok.*;
import repository.ICategoryRepository;
import service.ICategoryService;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService{

    private final ICategoryRepository categoryRepository;

    private Category toEntity(CategoryRequest req) {
        return Category.builder()
                .name(req.getName())
                .status(req.getStatus())  
                .build();
    }

    private CategoryResponse toResponse(Category entity) {
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .status(entity.getStatus())
                .build();
    }

    @Override
    public CategoryResponse create(CategoryRequest request){
        return toResponse(categoryRepository.save(toEntity(request)));
       
    
    }

    @Override
    public CategoryResponse update(Long id, CategoryRequest request){
        Category category = categoryRepository.findById(id).orElseThrow(()-> new RuntimeException("Category not found"));
        category.setName(request.getName());
        category.setStatus(request.getStatus());
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void delete(Long id){
        categoryRepository.deleteById(id);
    }

    @Override
    public CategoryResponse findById(Long id){
        return categoryRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(()-> new RuntimeException("Category not found"));
    }

    @Override
    public List<CategoryResponse> findAll(){
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }



}
