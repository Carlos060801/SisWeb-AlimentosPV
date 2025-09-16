package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Notification;

public interface INorificationRepository extends JpaRepository<Notification, Long> {
    
}
