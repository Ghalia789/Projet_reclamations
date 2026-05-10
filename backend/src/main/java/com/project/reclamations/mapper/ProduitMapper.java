package com.project.reclamations.mapper;

import com.project.reclamations.dto.request.ProduitRequestDTO;
import com.project.reclamations.dto.response.ProduitResponseDTO;
import com.project.reclamations.entity.Produit;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProduitMapper {

    @Autowired
    private ModelMapper modelMapper;

    public Produit toEntity(ProduitRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return modelMapper.map(dto, Produit.class);
    }

    public ProduitResponseDTO toResponseDTO(Produit entity) {
        if (entity == null) {
            return null;
        }
        return modelMapper.map(entity, ProduitResponseDTO.class);
    }
}
