package com.project.reclamations.mapper;

import com.project.reclamations.dto.request.AgentSAVRequestDTO;
import com.project.reclamations.dto.response.AgentSAVResponseDTO;
import com.project.reclamations.entity.AgentSAV;
import org.springframework.stereotype.Component;

@Component
public class AgentSAVMapper {

    public AgentSAV toEntity(AgentSAVRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return AgentSAV.builder()
                .nom(dto.getNom())
                .competence(dto.getCompetence())
                .build();
    }

    public AgentSAVResponseDTO toResponseDTO(AgentSAV entity) {
        if (entity == null) {
            return null;
        }
        return AgentSAVResponseDTO.builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .competence(entity.getCompetence())
                .build();
    }
}
