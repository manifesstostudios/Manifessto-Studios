package com.manifessto.backend.repository;

import com.manifessto.backend.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository
        extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findAllByOrderByDisplayOrderAsc();
}