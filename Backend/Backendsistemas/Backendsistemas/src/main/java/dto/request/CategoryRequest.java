package dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryRequest {

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    private String name;

    @NotBlank(message = "El estado de la categoría es obligatorio")
    private String status; // Ej: "ACTIVE", "INACTIVE"
    
}
