package dto.response;
import java.time.LocalDate;

import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class NotificationResponse {

    private Long id;
    private String message;
    private LocalDate notificationDate;
    private String status;


    //Información del Batch
    private Long batchId;
    private String batchNumber;
    private LocalDate expiryDate;

    //Información del Product (obtenida a través del batch)
    private Long productId;
    private String productName;

    //Información del User (para quién es la notificación)
    private Long userId;
    private String userName;
    
}
