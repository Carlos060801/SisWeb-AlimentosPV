package entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "batches")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Batch {


    @Id
    @Column(name = "batch_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "batch_number")
    private String batchNumber;
    @Column(name = "manufacture_date")
    private String manufactureDate;
    @Column(name = "expiry_date")
    private LocalDate expiryDate;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "location")
    private String location;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
}
