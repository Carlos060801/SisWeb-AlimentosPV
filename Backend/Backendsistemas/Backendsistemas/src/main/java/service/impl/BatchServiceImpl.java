package service.impl;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dto.request.BatchRequest;
import dto.response.BatchResponse;
import dto.response.ProductResponse;
import entity.Batch;
import entity.Product;
import lombok.*;
import repository.IBatchRepository;
import repository.IProductRepository;
import service.IBatchService;

@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements IBatchService {
    
    private final IBatchRepository batchRepository;
    private final IProductRepository productRepository;

    private Batch toEntity (BatchRequest req){
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(()-> new RuntimeException("Product not found"));

        return Batch.builder()
                .batchNumber(req.getBatchNumber())
                .manufactureDate(req.getManufactureDate())
                .expiryDate(req.getExpiryDate())
                .quantity(req.getQuantity())
                .location(req.getLocation())
                .product(product)
                .build();
    }

    private BatchResponse toResponse(Batch entity){
        return BatchResponse.builder()
                .id(entity.getId())
                .batchNumber(entity.getBatchNumber())
                .manufactureDate(entity.getManufactureDate())
                .expiryDate(entity.getExpiryDate())
                .quantity(entity.getQuantity())
                .location(entity.getLocation())
                .product(ProductResponse.builder()
                    .id(entity.getProduct().getId())
                    .name(entity.getProduct().getName())
                    .description(entity.getProduct().getDescription())
                    .status(entity.getProduct().getStatus())
                    .build())
                .build();
    }

    @Override
    public BatchResponse create(BatchRequest req) {
        return toResponse(batchRepository.save(toEntity(req)));
    }

    @Override
    public BatchResponse update(Long id, BatchRequest req) {
        Batch existingBatch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingBatch.setBatchNumber(req.getBatchNumber());
        existingBatch.setManufactureDate(req.getManufactureDate());
        existingBatch.setExpiryDate(req.getExpiryDate());
        existingBatch.setQuantity(req.getQuantity());
        existingBatch.setLocation(req.getLocation());
        existingBatch.setProduct(product);

        return toResponse(batchRepository.save(existingBatch));
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
            
    }

    @Override
    public BatchResponse findById(Long id) {
        return batchRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
    }

    @Override
    public List<BatchResponse> findAll() {
        return batchRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


}
