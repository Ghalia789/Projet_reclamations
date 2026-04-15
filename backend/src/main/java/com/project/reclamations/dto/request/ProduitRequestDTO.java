package com.project.reclamations.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduitRequestDTO {

    @NotBlank(message = "Le nom du produit est obligatoire")
    private String nom;

    @NotBlank(message = "La categorie est obligatoire")
    private String categorie;

    private String marque;

    private String modele;

    @PositiveOrZero(message = "La garantie doit etre positive")
    private Integer garantieMois;
}
