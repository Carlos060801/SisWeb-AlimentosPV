package controller;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.request.BatchRequest;
import dto.response.BatchResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import service.IBatchService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/batches")
@RequiredArgsConstructor

public class BatchController {

    private final IBatchService batchService;

    @PostMapping
    public ResponseEntity<BatchResponse> create(@Valid @RequestBody BatchRequest req){
        return  ResponseEntity.status(Response.SC_CREATED).body(batchService.create(req));

    }

    @PutMapping("/{id}")
    public ResponseEntity<BatchResponse> update(@PathVariable Long id, @Valid @RequestBody BatchRequest r) {
        return ResponseEntity.ok(batchService.update(id, r));
    }

    @GetMapping
    public ResponseEntity<List<BatchResponse>> getAll() {
        return ResponseEntity.ok(batchService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        batchService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
