package service;

import java.util.List;

import dto.response.NotificationResponse;

public interface INotificationService {
    
    NotificationResponse create(long batchId, Long userId, String message);
    NotificationResponse update(Long id, NotificationResponse notificationResponse);
    void delete(Long id);
    NotificationResponse findById(Long id);
    List<NotificationResponse> findAll();
}
