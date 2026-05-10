package com.project.reclamations.controller;

import com.project.reclamations.dto.request.SuiviReclamationRequestDTO;
import com.project.reclamations.dto.request.UpdateStatutRequestDTO;
import com.project.reclamations.dto.response.AgentSAVResponseDTO;
import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.entity.AgentSAV;
import com.project.reclamations.mapper.AgentSAVMapper;
import com.project.reclamations.service.AgentReclamationService;
import com.project.reclamations.service.CurrentUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/agents/me")
@Tag(name = "Agent - Mon Espace", description = "Acces agent a ses reclamations")
public class AgentMeController {

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AgentReclamationService agentReclamationService;

    @Autowired
    private AgentSAVMapper agentSAVMapper;

    @GetMapping
    @Operation(summary = "Recuperer le profil de l'agent connecte")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profil agent",
                    content = @Content(schema = @Schema(implementation = AgentSAVResponseDTO.class)))
    })
    public ResponseEntity<AgentSAVResponseDTO> getMyProfile() {
        AgentSAV agent = currentUserService.getCurrentAgent();
        return ResponseEntity.ok(agentSAVMapper.toResponseDTO(agent));
    }

    @GetMapping("/reclamations")
    @Operation(summary = "Lister les reclamations assignees a l'agent")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des reclamations",
                    content = @Content(schema = @Schema(implementation = ReclamationResponseDTO.class)))
    })
    public ResponseEntity<List<ReclamationResponseDTO>> getMyReclamations() {
        Long agentId = currentUserService.getCurrentAgent().getId();
        return ResponseEntity.ok(agentReclamationService.getMyReclamations(agentId));
    }

    @GetMapping("/reclamations/{id}")
    @Operation(summary = "Recuperer une reclamation assignee a l'agent")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reclamation trouvee",
                    content = @Content(schema = @Schema(implementation = ReclamationResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Reclamation introuvable")
    })
    public ResponseEntity<ReclamationResponseDTO> getMyReclamation(@PathVariable Long id) {
        Long agentId = currentUserService.getCurrentAgent().getId();
        return ResponseEntity.ok(agentReclamationService.getMyReclamationById(agentId, id));
    }

    @GetMapping("/reclamations/{id}/suivi")
    @Operation(summary = "Lister les suivis d'une reclamation assignee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des suivis",
                    content = @Content(schema = @Schema(implementation = SuiviReclamationResponseDTO.class)))
    })
    public ResponseEntity<List<SuiviReclamationResponseDTO>> getMySuivis(@PathVariable Long id) {
        Long agentId = currentUserService.getCurrentAgent().getId();
        return ResponseEntity.ok(agentReclamationService.getMySuivis(agentId, id));
    }

    @PostMapping("/reclamations/{id}/suivi")
    @Operation(summary = "Ajouter un suivi a une reclamation assignee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Suivi ajoute",
                    content = @Content(schema = @Schema(implementation = SuiviReclamationResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Reclamation introuvable")
    })
    public ResponseEntity<SuiviReclamationResponseDTO> addSuivi(
            @PathVariable Long id,
            @Valid @RequestBody SuiviReclamationRequestDTO requestDTO
    ) {
        Long agentId = currentUserService.getCurrentAgent().getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(agentReclamationService.addSuivi(agentId, id, requestDTO));
    }

    @PutMapping("/reclamations/{id}/statut")
    @Operation(summary = "Mettre a jour le statut d'une reclamation assignee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statut mis a jour",
                    content = @Content(schema = @Schema(implementation = ReclamationResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Reclamation introuvable")
    })
    public ResponseEntity<ReclamationResponseDTO> updateStatut(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatutRequestDTO requestDTO
    ) {
        Long agentId = currentUserService.getCurrentAgent().getId();
        return ResponseEntity.ok(agentReclamationService.updateStatut(agentId, id, requestDTO));
    }
}
