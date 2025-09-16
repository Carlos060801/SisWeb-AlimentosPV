package service;

import java.util.List;

import dto.request.BatchRequest;
import dto.response.BatchResponse;


public interface IBatchService {

    BatchResponse create(BatchRequest batchRequest);
    BatchResponse update(Long id, BatchRequest batchRequest);
    void delete(Long id);
    BatchResponse findById(Long id);
    List<BatchResponse> findAll();
    
}
