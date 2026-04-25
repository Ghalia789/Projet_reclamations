package com.project.reclamations.dto.request;

import com.project.reclamations.enums.StatutReclamation;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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

    @PositiveOrZero(message = "Le temps passe doit etre positif ou nul")
    private Integer timeSpentMinutes;
}
