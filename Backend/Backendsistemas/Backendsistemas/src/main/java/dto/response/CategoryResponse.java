package dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor  
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private String status; 
    
}
