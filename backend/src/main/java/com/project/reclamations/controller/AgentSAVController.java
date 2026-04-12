package com.project.reclamations.controller;

import com.project.reclamations.dto.response.AgentSAVResponseDTO;
import com.project.reclamations.exception.ApiErrorResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import com.project.reclamations.service.AgentSAVService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
@Tag(name = "Agents SAV", description = "Gestion des agents SAV")
public class AgentSAVController {

    private final AgentSAVService agentSAVService;

    @GetMapping
    @Operation(summary = "Lister tous les agents SAV")
        @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des agents SAV",
                content = @Content(array = @ArraySchema(schema = @Schema(implementation = AgentSAVResponseDTO.class)))),
            @ApiResponse(responseCode = "500", description = "Erreur interne",
                content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
        })
    public ResponseEntity<List<AgentSAVResponseDTO>> getAllAgents() {
        return ResponseEntity.ok(agentSAVService.getAllAgents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Recuperer un agent SAV par son identifiant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Agent SAV trouve",
                    content = @Content(schema = @Schema(implementation = AgentSAVResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Agent SAV introuvable",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<AgentSAVResponseDTO> getAgentById(@PathVariable Long id) {
        return ResponseEntity.ok(agentSAVService.getAgentById(id));
    }
}
