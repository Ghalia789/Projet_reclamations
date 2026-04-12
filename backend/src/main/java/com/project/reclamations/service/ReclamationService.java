package com.project.reclamations.service;

import com.project.reclamations.dto.request.ReclamationRequestDTO;
import com.project.reclamations.dto.request.SuiviReclamationRequestDTO;
import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.entity.AgentSAV;
import com.project.reclamations.entity.Client;
import com.project.reclamations.entity.Produit;
import com.project.reclamations.entity.Reclamation;
import com.project.reclamations.entity.SuiviReclamation;
import com.project.reclamations.enums.ActionSuivi;
import com.project.reclamations.enums.StatutReclamation;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.mapper.ReclamationMapper;
import com.project.reclamations.mapper.SuiviReclamationMapper;
import com.project.reclamations.repository.AgentSAVRepository;
import com.project.reclamations.repository.ClientRepository;
import com.project.reclamations.repository.ProduitRepository;
import com.project.reclamations.repository.ReclamationRepository;
import com.project.reclamations.repository.SuiviReclamationRepository;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final AgentSAVRepository agentSAVRepository;
    private final SuiviReclamationRepository suiviReclamationRepository;
    private final ReclamationMapper reclamationMapper;
    private final SuiviReclamationMapper suiviReclamationMapper;

    @Transactional(readOnly = true)
    public List<ReclamationResponseDTO> getAllReclamations() {
        return reclamationRepository.findAll()
                .stream()
                .map(reclamationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReclamationResponseDTO getReclamationById(Long id) {
        Reclamation reclamation = findReclamationById(id);
        return reclamationMapper.toResponseDTO(reclamation);
    }

    public ReclamationResponseDTO createReclamation(ReclamationRequestDTO requestDTO) {
        Client client = clientRepository.findById(requestDTO.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id : " + requestDTO.getClientId()));

        Produit produit = produitRepository.findById(requestDTO.getProduitId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec l'id : " + requestDTO.getProduitId()));

        AgentSAV agentAssigne = null;
        if (requestDTO.getAgentAssigneId() != null) {
            agentAssigne = agentSAVRepository.findById(requestDTO.getAgentAssigneId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + requestDTO.getAgentAssigneId()));
        }

        Reclamation reclamation = Reclamation.builder()
                .description(requestDTO.getDescription())
                .note(requestDTO.getNote())
                .client(client)
                .produit(produit)
                .agentAssigne(agentAssigne)
                .build();

        Reclamation saved = reclamationRepository.save(reclamation);

        createSuivi(saved, agentAssigne, ActionSuivi.CREATED, "Reclamation creee");
        if (agentAssigne != null) {
            createSuivi(saved, agentAssigne, ActionSuivi.ASSIGNED, "Reclamation assignee a un agent");
        }

        return reclamationMapper.toResponseDTO(saved);
    }

    public ReclamationResponseDTO assignAgent(Long reclamationId, Long agentId) {
        Reclamation reclamation = findReclamationById(reclamationId);
        AgentSAV agent = agentSAVRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + agentId));

        reclamation.setAgentAssigne(agent);
        if (reclamation.getStatut() == StatutReclamation.OUVERTE) {
            reclamation.setStatut(StatutReclamation.EN_COURS);
        }

        Reclamation updated = reclamationRepository.save(reclamation);
        createSuivi(updated, agent, ActionSuivi.ASSIGNED, "Agent assigne a la reclamation");

        return reclamationMapper.toResponseDTO(updated);
    }

    public ReclamationResponseDTO updateStatut(Long reclamationId, StatutReclamation nouveauStatut, String message) {
        Reclamation reclamation = findReclamationById(reclamationId);

        reclamation.setStatut(nouveauStatut);
        Reclamation updated = reclamationRepository.save(reclamation);

        ActionSuivi action = mapStatutToAction(nouveauStatut);
        String suiviMessage = message == null || message.isBlank()
                ? "Statut mis a jour vers " + nouveauStatut.name()
                : message;

        createSuivi(updated, updated.getAgentAssigne(), action, suiviMessage);

        return reclamationMapper.toResponseDTO(updated);
    }

    @Transactional(readOnly = true)
    public List<SuiviReclamationResponseDTO> getSuivisByReclamation(Long reclamationId) {
        findReclamationById(reclamationId);

        return suiviReclamationRepository.findByReclamationIdOrderByDateActionAsc(reclamationId)
                .stream()
                .map(suiviReclamationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public SuiviReclamationResponseDTO addSuivi(Long reclamationId, SuiviReclamationRequestDTO requestDTO) {
        Reclamation reclamation = findReclamationById(reclamationId);

        AgentSAV agentAuteur = null;
        if (requestDTO.getAgentAuteurId() != null) {
            agentAuteur = agentSAVRepository.findById(requestDTO.getAgentAuteurId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + requestDTO.getAgentAuteurId()));
        }

        SuiviReclamation saved = createSuivi(
                reclamation,
                agentAuteur,
                requestDTO.getAction(),
                requestDTO.getMessage()
        );

        return suiviReclamationMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRapportSatisfaction() {
        List<Reclamation> reclamations = reclamationRepository.findAll();

        long total = reclamations.size();
        long totalNotees = reclamations.stream().filter(r -> r.getNote() != null).count();
        double moyenne = reclamations.stream()
                .filter(r -> r.getNote() != null)
                .mapToInt(Reclamation::getNote)
                .average()
                .orElse(0.0);

        Map<StatutReclamation, Long> parStatut = new EnumMap<>(StatutReclamation.class);
        for (StatutReclamation statut : StatutReclamation.values()) {
            long count = reclamations.stream().filter(r -> r.getStatut() == statut).count();
            parStatut.put(statut, count);
        }

        return Map.of(
                "totalReclamations", total,
                "reclamationsNotees", totalNotees,
                "noteMoyenne", moyenne,
                "repartitionParStatut", parStatut
        );
    }

    private Reclamation findReclamationById(Long id) {
        return reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reclamation introuvable avec l'id : " + id));
    }

    private SuiviReclamation createSuivi(Reclamation reclamation, AgentSAV agentAuteur, ActionSuivi action, String message) {
        SuiviReclamation suivi = SuiviReclamation.builder()
                .reclamation(reclamation)
                .agentAuteur(agentAuteur)
                .action(action)
                .message(message)
                .build();

        return suiviReclamationRepository.save(suivi);
    }

    private ActionSuivi mapStatutToAction(StatutReclamation statut) {
        return switch (statut) {
            case OUVERTE, EN_COURS -> ActionSuivi.UPDATED;
            case RESOLUE -> ActionSuivi.RESOLVED;
            case FERMEE -> ActionSuivi.CLOSED;
        };
    }
}
