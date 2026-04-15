package com.project.reclamations.mapper;

import com.project.reclamations.dto.request.ProduitRequestDTO;
import com.project.reclamations.dto.response.ProduitResponseDTO;
import com.project.reclamations.entity.Produit;
import org.springframework.stereotype.Component;

@Component
public class ProduitMapper {

    public Produit toEntity(ProduitRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Produit.builder()
                .nom(dto.getNom())
                .categorie(dto.getCategorie())
            .marque(dto.getMarque())
            .modele(dto.getModele())
            .garantieMois(dto.getGarantieMois())
                .build();
    }

    public ProduitResponseDTO toResponseDTO(Produit entity) {
        if (entity == null) {
            return null;
        }
        return ProduitResponseDTO.builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .categorie(entity.getCategorie())
                .marque(entity.getMarque())
                .modele(entity.getModele())
                .garantieMois(entity.getGarantieMois())
                .build();
    }
}
