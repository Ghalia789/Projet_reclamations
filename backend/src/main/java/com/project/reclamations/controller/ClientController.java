package com.project.reclamations.controller;

import com.project.reclamations.dto.request.ClientRequestDTO;
import com.project.reclamations.dto.response.ClientResponseDTO;
import com.project.reclamations.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Tag(name = "Clients", description = "Gestion des clients")
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    @Operation(summary = "Lister tous les clients")
    public ResponseEntity<List<ClientResponseDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Recuperer un client par son identifiant")
    public ResponseEntity<ClientResponseDTO> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PostMapping
    @Operation(summary = "Creer un client")
    public ResponseEntity<ClientResponseDTO> createClient(@Valid @RequestBody ClientRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.createClient(requestDTO));
    }
}
