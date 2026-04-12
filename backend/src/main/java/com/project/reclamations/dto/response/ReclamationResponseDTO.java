package com.project.reclamations.dto.response;

import com.project.reclamations.enums.StatutReclamation;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReclamationResponseDTO {
    private Long id;
    private String description;
    private LocalDateTime dateCreation;
    private StatutReclamation statut;
    private Integer note;
    private Long clientId;
    private Long produitId;
    private Long agentAssigneId;
}
