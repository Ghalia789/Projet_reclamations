package com.project.reclamations.mapper;

import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.entity.SuiviReclamation;
import org.springframework.stereotype.Component;

@Component
public class SuiviReclamationMapper {

    public SuiviReclamationResponseDTO toResponseDTO(SuiviReclamation entity) {
        if (entity == null) {
            return null;
        }
        return SuiviReclamationResponseDTO.builder()
                .id(entity.getId())
                .message(entity.getMessage())
                .action(entity.getAction())
                .statutAvant(entity.getStatutAvant())
                .statutApres(entity.getStatutApres())
                .dateAction(entity.getDateAction())
                .reclamationId(entity.getReclamation() != null ? entity.getReclamation().getId() : null)
                .agentAuteurId(entity.getAgentAuteur() != null ? entity.getAgentAuteur().getId() : null)
                .build();
    }
}
