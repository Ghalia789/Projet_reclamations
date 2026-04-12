package com.project.reclamations.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentSAVRequestDTO {

    @NotBlank(message = "Le nom de l'agent est obligatoire")
    private String nom;

    @NotBlank(message = "La competence est obligatoire")
    private String competence;
}
