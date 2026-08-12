package com.manifessto.backend.service;

import com.manifessto.backend.entity.TeamMember;
import com.manifessto.backend.repository.TeamMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;


    public TeamMemberService(
            TeamMemberRepository teamMemberRepository
    ) {
        this.teamMemberRepository = teamMemberRepository;
    }


    // =====================================================
    // GET ALL TEAM MEMBERS
    // =====================================================

    public List<TeamMember> getAllTeamMembers() {

        return teamMemberRepository
                .findAllByOrderByDisplayOrderAsc();
    }


    // =====================================================
    // GET TEAM MEMBER BY ID
    // =====================================================

    public TeamMember getTeamMemberById(Long id) {

        return teamMemberRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Team member not found with id: "
                                        + id
                        )
                );
    }


    // =====================================================
    // ADD TEAM MEMBER
    // =====================================================

    @Transactional
    public TeamMember addTeamMember(
            TeamMember teamMember
    ) {

        return teamMemberRepository.save(
                teamMember
        );
    }


    // =====================================================
    // UPDATE TEAM MEMBER
    // =====================================================

    @Transactional
    public TeamMember updateTeamMember(
            Long id,
            TeamMember updatedTeamMember
    ) {

        TeamMember existingTeamMember =
                getTeamMemberById(id);


        existingTeamMember.setName(
                updatedTeamMember.getName()
        );

        existingTeamMember.setRole(
                updatedTeamMember.getRole()
        );

        existingTeamMember.setDescription(
                updatedTeamMember.getDescription()
        );

        existingTeamMember.setImageUrl(
                updatedTeamMember.getImageUrl()
        );

        existingTeamMember.setInstagram(
                updatedTeamMember.getInstagram()
        );

        existingTeamMember.setLinkedin(
                updatedTeamMember.getLinkedin()
        );

        existingTeamMember.setDisplayOrder(
                updatedTeamMember.getDisplayOrder()
        );


        return teamMemberRepository.save(
                existingTeamMember
        );
    }


    // =====================================================
    // DELETE TEAM MEMBER
    // =====================================================

    @Transactional
    public void deleteTeamMember(Long id) {

        TeamMember existingTeamMember =
                getTeamMemberById(id);

        teamMemberRepository.delete(
                existingTeamMember
        );
    }
}