package service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dto.request.ProductRequest;
import dto.response.CategoryResponse;
import dto.response.ProductResponse;
import dto.response.UserResponse;
import entity.Category;
import entity.Product;
import entity.User;
import lombok.*;
import repository.ICategoryRepository;
import repository.IProductRepository;
import repository.IUserRepository;
import service.IProductService;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {
    
    private final IProductRepository productRepository;
    private final ICategoryRepository categoryRepository;
    private final IUserRepository userRepository;

    private Product toEntity (ProductRequest req){
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(()-> new RuntimeException("Category not found"));

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));

        return Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .category(category)
                .user(user)
                .status(req.getStatus())
                .build();
    }

    private ProductResponse toResponse(Product entity){
        return ProductResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(CategoryResponse.builder()
                    .id(entity.getCategory().getId())
                    .name(entity.getCategory().getName())
                    .build())
                .user(UserResponse.builder()
                    .id(entity.getUser().getId())
                    .name(entity.getUser().getName())
                    .email(entity.getUser().getEmail())
                    .build())
                .status(entity.getStatus())
                .build();
    }

    @Override
    public ProductResponse create(ProductRequest request){
        return toResponse(productRepository.save(toEntity(request)));
    }

    @Override
    public ProductResponse update(Long id, ProductRequest request){
        Product product = productRepository.findById(id).orElseThrow(()-> new RuntimeException("Product not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(()-> new RuntimeException("Category not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setUser(user);
        product.setStatus(request.getStatus());
        return toResponse(productRepository.save(product));
    }

    @Override
    public void delete(Long id){
        productRepository.deleteById(id);
    }

    @Override
    public ProductResponse findById(Long id){
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(()-> new RuntimeException("Product not found"));
    }
    @Override
    public List<ProductResponse> findAll(){
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
