package com.project.reclamations.dto.response;

import com.project.reclamations.enums.ActionSuivi;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuiviReclamationResponseDTO {
    private Long id;
    private String message;
    private ActionSuivi action;
    private LocalDateTime dateAction;
    private Long reclamationId;
    private Long agentAuteurId;
}
