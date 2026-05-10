package com.project.reclamations.mapper;

import com.project.reclamations.dto.request.ClientRequestDTO;
import com.project.reclamations.dto.response.ClientResponseDTO;
import com.project.reclamations.entity.Client;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClientMapper {

    @Autowired
    private ModelMapper modelMapper;

    public Client toEntity(ClientRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return modelMapper.map(dto, Client.class);
    }

    public ClientResponseDTO toResponseDTO(Client entity) {
        if (entity == null) {
            return null;
        }
        return modelMapper.map(entity, ClientResponseDTO.class);
    }
}
