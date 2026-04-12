package com.project.reclamations.service;

import com.project.reclamations.dto.request.ClientRequestDTO;
import com.project.reclamations.dto.response.ClientResponseDTO;
import com.project.reclamations.entity.Client;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.mapper.ClientMapper;
import com.project.reclamations.repository.ClientRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Transactional(readOnly = true)
    public List<ClientResponseDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(clientMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClientResponseDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id : " + id));
        return clientMapper.toResponseDTO(client);
    }

    public ClientResponseDTO createClient(ClientRequestDTO requestDTO) {
        if (clientRepository.existsByEmail(requestDTO.getEmail())) {
            throw new IllegalArgumentException("Un client avec cet email existe deja");
        }

        Client client = clientMapper.toEntity(requestDTO);
        Client savedClient = clientRepository.save(client);
        return clientMapper.toResponseDTO(savedClient);
    }

    public ClientResponseDTO updateClient(Long id, ClientRequestDTO requestDTO) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id : " + id));

        clientRepository.findByEmail(requestDTO.getEmail())
                .filter(client -> !client.getId().equals(id))
                .ifPresent(client -> {
                    throw new IllegalArgumentException("Un client avec cet email existe deja");
                });

        existingClient.setNom(requestDTO.getNom());
        existingClient.setEmail(requestDTO.getEmail());
        existingClient.setTelephone(requestDTO.getTelephone());

        return clientMapper.toResponseDTO(clientRepository.save(existingClient));
    }

    public void deleteClient(Long id) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id : " + id));
        clientRepository.delete(existingClient);
    }
}
