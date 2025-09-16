package dto.response;

import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String rol;
    private String account_status;
    
}
