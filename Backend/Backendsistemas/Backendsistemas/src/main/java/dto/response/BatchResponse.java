package dto.response;

import java.time.LocalDate;

import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchResponse {

    private Long id;
    private String batchNumber;
    private String manufactureDate;
    private LocalDate expiryDate;
    private Integer quantity;
    private String location;
    private ProductResponse product;
    
}
