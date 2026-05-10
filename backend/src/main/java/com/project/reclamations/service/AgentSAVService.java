package com.project.reclamations.service;

import com.project.reclamations.dto.request.AgentSAVRequestDTO;
import com.project.reclamations.dto.response.AgentSAVResponseDTO;
import com.project.reclamations.entity.AgentSAV;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.mapper.AgentSAVMapper;
import com.project.reclamations.repository.AgentSAVRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AgentSAVService {

    @Autowired
    private AgentSAVRepository agentSAVRepository;

    @Autowired
    private AgentSAVMapper agentSAVMapper;

    @Transactional(readOnly = true)
    public List<AgentSAVResponseDTO> getAllAgents() {
        return agentSAVRepository.findAll()
                .stream()
                .map(agentSAVMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AgentSAVResponseDTO getAgentById(Long id) {
        AgentSAV agent = agentSAVRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + id));
        return agentSAVMapper.toResponseDTO(agent);
    }

    public AgentSAVResponseDTO createAgent(AgentSAVRequestDTO requestDTO) {
        AgentSAV agent = agentSAVMapper.toEntity(requestDTO);
        return agentSAVMapper.toResponseDTO(agentSAVRepository.save(agent));
    }

    public AgentSAVResponseDTO updateAgent(Long id, AgentSAVRequestDTO requestDTO) {
        AgentSAV agent = agentSAVRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + id));

        agent.setNom(requestDTO.getNom());
        agent.setCompetence(requestDTO.getCompetence());
        agent.setNiveau(requestDTO.getNiveau());
        agent.setEquipe(requestDTO.getEquipe());
        agent.setActif(requestDTO.getActif());

        return agentSAVMapper.toResponseDTO(agentSAVRepository.save(agent));
    }

    public void deleteAgent(Long id) {
        AgentSAV agent = agentSAVRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + id));
        agentSAVRepository.delete(agent);
    }
}
