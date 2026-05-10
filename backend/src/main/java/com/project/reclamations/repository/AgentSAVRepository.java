package com.project.reclamations.repository;

import com.project.reclamations.entity.AgentSAV;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentSAVRepository extends JpaRepository<AgentSAV, Long> {
	Optional<AgentSAV> findByUserAccountId(Long userAccountId);
}
