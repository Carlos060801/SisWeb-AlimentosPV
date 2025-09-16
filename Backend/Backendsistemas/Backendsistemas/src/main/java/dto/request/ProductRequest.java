package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String name;

    @NotNull
    private String description;

    @NotBlank(message = "El estado del producto es obligatorio")
    private String status;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoryId;

    @NotNull(message = "El usuario es obligatorio")
    private Long userId;
    
}
