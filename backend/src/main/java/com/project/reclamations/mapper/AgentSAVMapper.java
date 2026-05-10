package com.project.reclamations.mapper;

import com.project.reclamations.dto.request.AgentSAVRequestDTO;
import com.project.reclamations.dto.response.AgentSAVResponseDTO;
import com.project.reclamations.entity.AgentSAV;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AgentSAVMapper {

    @Autowired
    private ModelMapper modelMapper;

    public AgentSAV toEntity(AgentSAVRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return modelMapper.map(dto, AgentSAV.class);
    }

    public AgentSAVResponseDTO toResponseDTO(AgentSAV entity) {
        if (entity == null) {
            return null;
        }
        return modelMapper.map(entity, AgentSAVResponseDTO.class);
    }
}
