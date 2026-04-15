package com.project.reclamations.dto.response;

import com.project.reclamations.enums.TypeClient;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponseDTO {
    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private TypeClient typeClient;
    private String ville;
    private LocalDateTime dateInscription;
}
