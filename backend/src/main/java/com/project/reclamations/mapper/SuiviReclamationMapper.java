package com.project.reclamations.mapper;

import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.entity.SuiviReclamation;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SuiviReclamationMapper {

    @Autowired
    private ModelMapper modelMapper;

    public SuiviReclamationResponseDTO toResponseDTO(SuiviReclamation entity) {
        if (entity == null) {
            return null;
        }
        return modelMapper.map(entity, SuiviReclamationResponseDTO.class);
    }
}
