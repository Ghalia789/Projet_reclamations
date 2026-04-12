package com.project.reclamations.dto.request;

import com.project.reclamations.enums.StatutReclamation;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatutRequestDTO {

    @NotNull(message = "Le nouveau statut est obligatoire")
    private StatutReclamation statut;

    private String message;
}
