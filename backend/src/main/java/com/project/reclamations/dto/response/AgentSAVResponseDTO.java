package com.project.reclamations.dto.response;

import com.project.reclamations.enums.NiveauAgent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentSAVResponseDTO {
    private Long id;
    private String nom;
    private String competence;
    private NiveauAgent niveau;
    private String equipe;
    private Boolean actif;
}
