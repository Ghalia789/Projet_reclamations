package com.project.reclamations.mapper;

import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.entity.Reclamation;
import org.springframework.stereotype.Component;

@Component
public class ReclamationMapper {

    public ReclamationResponseDTO toResponseDTO(Reclamation entity) {
        if (entity == null) {
            return null;
        }
        return ReclamationResponseDTO.builder()
                .id(entity.getId())
                .description(entity.getDescription())
                .dateCreation(entity.getDateCreation())
                .statut(entity.getStatut())
                .note(entity.getNote())
                .clientId(entity.getClient() != null ? entity.getClient().getId() : null)
                .produitId(entity.getProduit() != null ? entity.getProduit().getId() : null)
                .agentAssigneId(entity.getAgentAssigne() != null ? entity.getAgentAssigne().getId() : null)
                .build();
    }
}
