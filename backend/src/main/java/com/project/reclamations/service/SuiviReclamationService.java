package com.project.reclamations.service;

import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.mapper.SuiviReclamationMapper;
import com.project.reclamations.repository.SuiviReclamationRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SuiviReclamationService {

    @Autowired
    private SuiviReclamationRepository suiviReclamationRepository;

    @Autowired
    private SuiviReclamationMapper suiviReclamationMapper;

    @Transactional(readOnly = true)
    public List<SuiviReclamationResponseDTO> getAllSuivis() {
        return suiviReclamationRepository.findAll()
                .stream()
                .map(suiviReclamationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SuiviReclamationResponseDTO getSuiviById(Long id) {
        return suiviReclamationRepository.findById(id)
                .map(suiviReclamationMapper::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Suivi de reclamation introuvable avec l'id : " + id));
    }
}
