package com.project.reclamations.service;

import com.project.reclamations.dto.request.AdminAccountCreateRequestDTO;
import com.project.reclamations.dto.request.AdminAccountUpdateRequestDTO;
import com.project.reclamations.dto.request.AdminPasswordResetRequestDTO;
import com.project.reclamations.dto.response.AdminAccountResponseDTO;
import com.project.reclamations.entity.AgentSAV;
import com.project.reclamations.entity.UserAccount;
import com.project.reclamations.enums.UserRole;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.repository.AgentSAVRepository;
import com.project.reclamations.repository.UserAccountRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AccountService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private AgentSAVRepository agentSAVRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AdminAccountResponseDTO createAccount(AdminAccountCreateRequestDTO requestDTO) {
        if (userAccountRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Un compte avec cet email existe deja");
        }

        UserRole role = requestDTO.getRole() == null ? UserRole.AGENT : requestDTO.getRole();
        if (role == UserRole.ADMIN && requestDTO.getAgentId() != null) {
            throw new IllegalArgumentException("Un compte admin ne peut pas etre associe a un agent");
        }
        if (role == UserRole.AGENT && requestDTO.getAgentId() == null) {
            throw new IllegalArgumentException("Un agent doit etre associe a un compte agent");
        }

        UserAccount account = UserAccount.builder()
                .email(requestDTO.getEmail())
                .passwordHash(passwordEncoder.encode(requestDTO.getPassword()))
                .role(role)
                .enabled(requestDTO.getEnabled() == null ? Boolean.TRUE : requestDTO.getEnabled())
                .build();

        UserAccount saved = userAccountRepository.save(account);

        if (requestDTO.getAgentId() != null) {
            linkAccountToAgent(saved, requestDTO.getAgentId());
        }

        return toResponse(saved, getAgentId(saved.getId()));
    }

    public AdminAccountResponseDTO updateAccount(Long accountId, AdminAccountUpdateRequestDTO requestDTO) {
        UserAccount account = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte introuvable avec l'id : " + accountId));

        if (requestDTO.getEmail() != null && !requestDTO.getEmail().equals(account.getEmail())) {
            if (userAccountRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Un compte avec cet email existe deja");
            }
            account.setEmail(requestDTO.getEmail());
        }

        if (requestDTO.getRole() != null) {
            if (requestDTO.getRole() == UserRole.ADMIN && requestDTO.getAgentId() != null) {
                throw new IllegalArgumentException("Un compte admin ne peut pas etre associe a un agent");
            }
            account.setRole(requestDTO.getRole());
        }

        if (requestDTO.getEnabled() != null) {
            account.setEnabled(requestDTO.getEnabled());
        }

        UserAccount saved = userAccountRepository.save(account);

        if (Boolean.TRUE.equals(requestDTO.getUnlinkAgent())) {
            unlinkAccountFromAgent(saved.getId());
        }

        if (requestDTO.getAgentId() != null) {
            linkAccountToAgent(saved, requestDTO.getAgentId());
        } else if (saved.getRole() == UserRole.ADMIN) {
            unlinkAccountFromAgent(saved.getId());
        }

        return toResponse(saved, getAgentId(saved.getId()));
    }

    public void resetPassword(Long accountId, AdminPasswordResetRequestDTO requestDTO) {
        UserAccount account = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte introuvable avec l'id : " + accountId));
        account.setPasswordHash(passwordEncoder.encode(requestDTO.getNewPassword()));
        userAccountRepository.save(account);
    }

    @Transactional(readOnly = true)
    public List<AdminAccountResponseDTO> getAllAccounts() {
        return userAccountRepository.findAll()
                .stream()
                .map(account -> toResponse(account, getAgentId(account.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminAccountResponseDTO getAccount(Long accountId) {
        UserAccount account = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte introuvable avec l'id : " + accountId));
        return toResponse(account, getAgentId(account.getId()));
    }

    private void linkAccountToAgent(UserAccount account, Long agentId) {
        AgentSAV agent = agentSAVRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent introuvable avec l'id : " + agentId));

        if (agent.getUserAccount() != null && !agent.getUserAccount().getId().equals(account.getId())) {
            throw new IllegalArgumentException("Cet agent est deja lie a un autre compte");
        }

        Optional<AgentSAV> currentLink = agentSAVRepository.findByUserAccountId(account.getId());
        if (currentLink.isPresent() && !currentLink.get().getId().equals(agent.getId())) {
            currentLink.get().setUserAccount(null);
            agentSAVRepository.save(currentLink.get());
        }

        agent.setUserAccount(account);
        agentSAVRepository.save(agent);
    }

    private void unlinkAccountFromAgent(Long accountId) {
        Optional<AgentSAV> currentLink = agentSAVRepository.findByUserAccountId(accountId);
        if (currentLink.isPresent()) {
            currentLink.get().setUserAccount(null);
            agentSAVRepository.save(currentLink.get());
        }
    }

    private Long getAgentId(Long accountId) {
        return agentSAVRepository.findByUserAccountId(accountId)
                .map(AgentSAV::getId)
                .orElse(null);
    }

    private AdminAccountResponseDTO toResponse(UserAccount account, Long agentId) {
        return AdminAccountResponseDTO.builder()
                .id(account.getId())
                .email(account.getEmail())
                .role(account.getRole().name())
                .enabled(account.getEnabled())
                .agentId(agentId)
                .build();
    }
}
