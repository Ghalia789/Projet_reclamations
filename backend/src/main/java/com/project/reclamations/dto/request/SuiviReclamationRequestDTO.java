package com.project.reclamations.dto.request;

import com.project.reclamations.enums.ActionSuivi;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuiviReclamationRequestDTO {

    @NotBlank(message = "Le message de suivi est obligatoire")
    private String message;

    @NotNull(message = "L'action de suivi est obligatoire")
    private ActionSuivi action;

    private Long agentAuteurId;
}
