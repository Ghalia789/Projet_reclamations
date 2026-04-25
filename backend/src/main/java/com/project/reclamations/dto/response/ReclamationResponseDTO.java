package com.project.reclamations.dto.response;

import com.project.reclamations.enums.CanalOrigineReclamation;
import com.project.reclamations.enums.PrioriteReclamation;
import com.project.reclamations.enums.RootCauseReclamation;
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
    private String numeroTicket;
    private String description;
    private LocalDateTime dateCreation;
    private LocalDateTime dateResolution;
    private StatutReclamation statut;
    private PrioriteReclamation priorite;
    private CanalOrigineReclamation canalOrigine;
    private LocalDateTime slaDueAt;
    private RootCauseReclamation rootCause;
    private Integer reopenCount;
    private Integer note;
    private Long clientId;
    private Long produitId;
    private Long agentAssigneId;
}
