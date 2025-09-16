package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Batch;

public interface IBatchRepository extends JpaRepository<Batch, Long> {
    
}
