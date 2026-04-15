package com.project.reclamations.mapper;

import com.project.reclamations.dto.request.ClientRequestDTO;
import com.project.reclamations.dto.response.ClientResponseDTO;
import com.project.reclamations.entity.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    public Client toEntity(ClientRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Client.builder()
                .nom(dto.getNom())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
            .typeClient(dto.getTypeClient())
            .ville(dto.getVille())
                .build();
    }

    public ClientResponseDTO toResponseDTO(Client entity) {
        if (entity == null) {
            return null;
        }
        return ClientResponseDTO.builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .email(entity.getEmail())
                .telephone(entity.getTelephone())
                .typeClient(entity.getTypeClient())
                .ville(entity.getVille())
                .dateInscription(entity.getDateInscription())
                .build();
    }
}
