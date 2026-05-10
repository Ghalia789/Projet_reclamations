package com.project.reclamations.config;

import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.entity.Reclamation;
import com.project.reclamations.entity.SuiviReclamation;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
    ModelMapper modelMapper = new ModelMapper();

    modelMapper.typeMap(Reclamation.class, ReclamationResponseDTO.class)
        .addMappings(mapper -> {
            mapper.map(source -> source.getClient() == null ? null : source.getClient().getId(),
                ReclamationResponseDTO::setClientId);
            mapper.map(source -> source.getProduit() == null ? null : source.getProduit().getId(),
                ReclamationResponseDTO::setProduitId);
            mapper.map(source -> source.getAgentAssigne() == null ? null : source.getAgentAssigne().getId(),
                ReclamationResponseDTO::setAgentAssigneId);
        });

    modelMapper.typeMap(SuiviReclamation.class, SuiviReclamationResponseDTO.class)
        .addMappings(mapper -> {
            mapper.map(source -> source.getReclamation() == null ? null : source.getReclamation().getId(),
                SuiviReclamationResponseDTO::setReclamationId);
            mapper.map(source -> source.getAgentAuteur() == null ? null : source.getAgentAuteur().getId(),
                SuiviReclamationResponseDTO::setAgentAuteurId);
        });

    return modelMapper;
    }
}