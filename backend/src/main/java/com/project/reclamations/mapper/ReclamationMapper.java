package com.project.reclamations.mapper;

import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.entity.Reclamation;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReclamationMapper {

    @Autowired
    private ModelMapper modelMapper;

    public ReclamationResponseDTO toResponseDTO(Reclamation entity) {
        if (entity == null) {
            return null;
        }
        return modelMapper.map(entity, ReclamationResponseDTO.class);
    }
}
