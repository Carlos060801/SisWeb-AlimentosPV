package dto.response;

import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private String status;

    // Se puede devolver un objeto reducido con la info necesaria
    private CategoryResponse category;
    private UserResponse user;
    
}
