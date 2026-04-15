package com.project.reclamations.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduitResponseDTO {
    private Long id;
    private String nom;
    private String categorie;
    private String marque;
    private String modele;
    private Integer garantieMois;
}
