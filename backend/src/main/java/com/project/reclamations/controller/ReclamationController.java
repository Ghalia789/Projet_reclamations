package com.project.reclamations.controller;

import com.project.reclamations.dto.request.AssignAgentRequestDTO;
import com.project.reclamations.dto.request.ReclamationRequestDTO;
import com.project.reclamations.dto.request.SuiviReclamationRequestDTO;
import com.project.reclamations.dto.request.UpdateStatutRequestDTO;
import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.service.ReclamationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/reclamations")
@RequiredArgsConstructor
@Tag(name = "Reclamations", description = "Gestion des reclamations")
public class ReclamationController {

    private final ReclamationService reclamationService;

    @GetMapping
    @Operation(summary = "Lister toutes les reclamations")
    public ResponseEntity<List<ReclamationResponseDTO>> getAllReclamations() {
        return ResponseEntity.ok(reclamationService.getAllReclamations());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Recuperer une reclamation par son identifiant")
    public ResponseEntity<ReclamationResponseDTO> getReclamationById(@PathVariable Long id) {
        return ResponseEntity.ok(reclamationService.getReclamationById(id));
    }

    @PostMapping
    @Operation(summary = "Creer une reclamation")
    public ResponseEntity<ReclamationResponseDTO> createReclamation(@Valid @RequestBody ReclamationRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reclamationService.createReclamation(requestDTO));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assigner un agent a une reclamation")
    public ResponseEntity<ReclamationResponseDTO> assignAgent(
            @PathVariable Long id,
            @Valid @RequestBody AssignAgentRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(reclamationService.assignAgent(id, requestDTO.getAgentId()));
    }

    @PutMapping("/{id}/statut")
    @Operation(summary = "Mettre a jour le statut d'une reclamation")
    public ResponseEntity<ReclamationResponseDTO> updateStatut(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatutRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(reclamationService.updateStatut(id, requestDTO.getStatut(), requestDTO.getMessage()));
    }

    @GetMapping("/{id}/suivi")
    @Operation(summary = "Recuperer le suivi d'une reclamation")
    public ResponseEntity<List<SuiviReclamationResponseDTO>> getSuivisByReclamation(@PathVariable Long id) {
        return ResponseEntity.ok(reclamationService.getSuivisByReclamation(id));
    }

    @PostMapping("/{id}/suivi")
    @Operation(summary = "Ajouter une entree de suivi a une reclamation")
    public ResponseEntity<SuiviReclamationResponseDTO> addSuivi(
            @PathVariable Long id,
            @Valid @RequestBody SuiviReclamationRequestDTO requestDTO
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reclamationService.addSuivi(id, requestDTO));
    }

    @GetMapping("/rapport")
    @Operation(summary = "Generer le rapport de satisfaction")
    public ResponseEntity<Map<String, Object>> getRapport() {
        return ResponseEntity.ok(reclamationService.getRapportSatisfaction());
    }
}
