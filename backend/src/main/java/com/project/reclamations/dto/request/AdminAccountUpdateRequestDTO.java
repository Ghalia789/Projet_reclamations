package com.project.reclamations.dto.request;

import com.project.reclamations.enums.UserRole;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAccountUpdateRequestDTO {

    @Email(message = "Email invalide")
    private String email;

    private UserRole role;

    private Boolean enabled;

    private Long agentId;

    private Boolean unlinkAgent;
}
