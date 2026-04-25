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
            .numeroTicket(entity.getNumeroTicket())
                .description(entity.getDescription())
                .dateCreation(entity.getDateCreation())
            .dateResolution(entity.getDateResolution())
                .statut(entity.getStatut())
            .priorite(entity.getPriorite())
            .canalOrigine(entity.getCanalOrigine())
                .slaDueAt(entity.getSlaDueAt())
                .rootCause(entity.getRootCause())
                .reopenCount(entity.getReopenCount())
                .note(entity.getNote())
                .clientId(entity.getClient() != null ? entity.getClient().getId() : null)
                .produitId(entity.getProduit() != null ? entity.getProduit().getId() : null)
                .agentAssigneId(entity.getAgentAssigne() != null ? entity.getAgentAssigne().getId() : null)
                .build();
    }
}
