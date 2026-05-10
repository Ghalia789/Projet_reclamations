package com.project.reclamations.service;

import com.project.reclamations.dto.request.SuiviReclamationRequestDTO;
import com.project.reclamations.dto.request.UpdateStatutRequestDTO;
import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.entity.AgentSAV;
import com.project.reclamations.entity.Reclamation;
import com.project.reclamations.entity.SuiviReclamation;
import com.project.reclamations.enums.ActionSuivi;
import com.project.reclamations.enums.StatutReclamation;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.mapper.ReclamationMapper;
import com.project.reclamations.mapper.SuiviReclamationMapper;
import com.project.reclamations.repository.AgentSAVRepository;
import com.project.reclamations.repository.ReclamationRepository;
import com.project.reclamations.repository.SuiviReclamationRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AgentReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private SuiviReclamationRepository suiviReclamationRepository;

    @Autowired
    private AgentSAVRepository agentSAVRepository;

    @Autowired
    private ReclamationMapper reclamationMapper;

    @Autowired
    private SuiviReclamationMapper suiviReclamationMapper;

    @Transactional(readOnly = true)
    public List<ReclamationResponseDTO> getMyReclamations(Long agentId) {
        return reclamationRepository.findByAgentAssigneId(agentId)
                .stream()
                .map(reclamationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReclamationResponseDTO getMyReclamationById(Long agentId, Long reclamationId) {
        Reclamation reclamation = findAssignedReclamation(agentId, reclamationId);
        return reclamationMapper.toResponseDTO(reclamation);
    }

    @Transactional(readOnly = true)
    public List<SuiviReclamationResponseDTO> getMySuivis(Long agentId, Long reclamationId) {
        findAssignedReclamation(agentId, reclamationId);
        return suiviReclamationRepository.findByReclamationIdOrderByDateActionAsc(reclamationId)
                .stream()
                .map(suiviReclamationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public SuiviReclamationResponseDTO addSuivi(Long agentId, Long reclamationId, SuiviReclamationRequestDTO requestDTO) {
        Reclamation reclamation = findAssignedReclamation(agentId, reclamationId);
        AgentSAV agentAuteur = agentSAVRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent introuvable avec l'id : " + agentId));

        SuiviReclamation suivi = SuiviReclamation.builder()
                .reclamation(reclamation)
                .agentAuteur(agentAuteur)
                .action(requestDTO.getAction())
                .message(requestDTO.getMessage())
                .statutAvant(reclamation.getStatut())
                .statutApres(reclamation.getStatut())
                .timeSpentMinutes(requestDTO.getTimeSpentMinutes())
                .build();

        SuiviReclamation saved = suiviReclamationRepository.save(suivi);
        return suiviReclamationMapper.toResponseDTO(saved);
    }

    public ReclamationResponseDTO updateStatut(Long agentId, Long reclamationId, UpdateStatutRequestDTO requestDTO) {
        Reclamation reclamation = findAssignedReclamation(agentId, reclamationId);
        StatutReclamation statutAvant = reclamation.getStatut();

        boolean wasClosedState = statutAvant == StatutReclamation.RESOLUE || statutAvant == StatutReclamation.FERMEE;
        boolean isReopenedState = requestDTO.getStatut() == StatutReclamation.OUVERTE
                || requestDTO.getStatut() == StatutReclamation.EN_COURS;
        if (wasClosedState && isReopenedState) {
            Integer currentReopenCount = reclamation.getReopenCount() == null ? 0 : reclamation.getReopenCount();
            reclamation.setReopenCount(currentReopenCount + 1);
        }

        reclamation.setStatut(requestDTO.getStatut());
        if (requestDTO.getStatut() == StatutReclamation.RESOLUE || requestDTO.getStatut() == StatutReclamation.FERMEE) {
            if (reclamation.getDateResolution() == null) {
                reclamation.setDateResolution(java.time.LocalDateTime.now());
            }
        } else {
            reclamation.setDateResolution(null);
        }

        Reclamation updated = reclamationRepository.save(reclamation);

        ActionSuivi action = mapStatutToAction(requestDTO.getStatut());
        String suiviMessage = requestDTO.getMessage() == null || requestDTO.getMessage().isBlank()
                ? "Statut mis a jour vers " + requestDTO.getStatut().name()
                : requestDTO.getMessage();

        SuiviReclamation suivi = SuiviReclamation.builder()
                .reclamation(updated)
                .agentAuteur(updated.getAgentAssigne())
                .action(action)
                .message(suiviMessage)
                .statutAvant(statutAvant)
                .statutApres(updated.getStatut())
                .timeSpentMinutes(requestDTO.getTimeSpentMinutes())
                .build();

        suiviReclamationRepository.save(suivi);

        return reclamationMapper.toResponseDTO(updated);
    }

    private Reclamation findAssignedReclamation(Long agentId, Long reclamationId) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reclamation introuvable avec l'id : " + reclamationId));

        if (reclamation.getAgentAssigne() == null || !reclamation.getAgentAssigne().getId().equals(agentId)) {
            throw new ResourceNotFoundException("Reclamation non assignee a cet agent");
        }

        return reclamation;
    }

    private ActionSuivi mapStatutToAction(StatutReclamation statut) {
        return switch (statut) {
            case OUVERTE, EN_COURS -> ActionSuivi.UPDATED;
            case RESOLUE -> ActionSuivi.RESOLVED;
            case FERMEE -> ActionSuivi.CLOSED;
        };
    }
}
