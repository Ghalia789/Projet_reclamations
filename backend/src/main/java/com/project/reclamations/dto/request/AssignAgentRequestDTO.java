package com.project.reclamations.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignAgentRequestDTO {

    @NotNull(message = "L'identifiant de l'agent est obligatoire")
    private Long agentId;
}
