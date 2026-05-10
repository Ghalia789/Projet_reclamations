package com.project.reclamations.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAccountResponseDTO {

    private Long id;
    private String email;
    private String role;
    private Boolean enabled;
    private Long agentId;
}
