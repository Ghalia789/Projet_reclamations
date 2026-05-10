package com.project.reclamations.controller;

import com.project.reclamations.dto.request.LoginRequestDTO;
import com.project.reclamations.dto.response.AuthResponseDTO;
import com.project.reclamations.entity.UserAccount;
import com.project.reclamations.enums.UserRole;
import com.project.reclamations.repository.AgentSAVRepository;
import com.project.reclamations.repository.UserAccountRepository;
import com.project.reclamations.security.UserAccountDetails;
import com.project.reclamations.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentification", description = "Gestion de l'authentification JWT")
public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private UserDetailsService userDetailsService;

        @Autowired
        private JwtService jwtService;

        @Autowired
        private UserAccountRepository userAccountRepository;

        @Autowired
        private AgentSAVRepository agentSAVRepository;

    @PostMapping("/login")
    @Operation(summary = "Authentifier un utilisateur et generer un token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Connexion reussie",
                    content = @Content(schema = @Schema(implementation = AuthResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Donnees invalides"),
            @ApiResponse(responseCode = "401", description = "Identifiants invalides")
    })
    public AuthResponseDTO login(@Valid @RequestBody LoginRequestDTO requestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(requestDTO.getEmail(), requestDTO.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(requestDTO.getEmail());
        UserRole role = userDetails instanceof UserAccountDetails details
                ? details.getUserAccount().getRole()
                : UserRole.ADMIN;

        Optional<UserAccount> account = userAccountRepository.findByEmail(requestDTO.getEmail());
        Long agentId = account.flatMap(acc -> agentSAVRepository.findByUserAccountId(acc.getId()))
                .map(agent -> agent.getId())
                .orElse(null);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role.name());
        if (agentId != null) {
            claims.put("agentId", agentId);
        }

        String token = jwtService.generateToken(claims, userDetails);

        return AuthResponseDTO.builder()
                .token(token)
                .tokenType("Bearer")
                .username(userDetails.getUsername())
                .role(role.name())
                .agentId(agentId)
                .build();
    }
}
