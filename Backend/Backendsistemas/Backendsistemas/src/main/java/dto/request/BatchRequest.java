package dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchRequest {

    @NotBlank(message = "El número de lote es obligatorio")
    private String batchNumber;

    @NotBlank(message = "La fecha de fabricación es obligatoria")
    private String manufactureDate;

    @NotBlank(message = "La fecha de vencimiento es obligatoria")
    private LocalDate expiryDate;

    @NotNull
    private Integer quantity;

    @NotBlank(message = "La ubicación es obligatoria")
    private String location;

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productId;
    
}
