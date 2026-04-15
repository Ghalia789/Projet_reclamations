package com.project.reclamations.dto.request;

import com.project.reclamations.enums.CanalOrigineReclamation;
import com.project.reclamations.enums.PrioriteReclamation;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class ReclamationRequestDTO {

    @NotBlank(message = "La description de la reclamation est obligatoire")
    private String description;

    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    private Integer note;

    @NotNull(message = "L'identifiant du client est obligatoire")
    private Long clientId;

    @NotNull(message = "L'identifiant du produit est obligatoire")
    private Long produitId;

    private Long agentAssigneId;

    private PrioriteReclamation priorite;

    private CanalOrigineReclamation canalOrigine;
}
