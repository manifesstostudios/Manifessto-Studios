package com.manifessto.backend.controller;

import com.manifessto.backend.entity.TeamMember;
import com.manifessto.backend.service.TeamMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-members")
@CrossOrigin(origins = "http://localhost:5173")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;


    public TeamMemberController(
            TeamMemberService teamMemberService
    ) {
        this.teamMemberService = teamMemberService;
    }


    // =====================================================
    // GET ALL TEAM MEMBERS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<TeamMember>> getAllTeamMembers() {

        return ResponseEntity.ok(
                teamMemberService.getAllTeamMembers()
        );
    }


    // =====================================================
    // GET TEAM MEMBER BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<TeamMember> getTeamMemberById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                teamMemberService.getTeamMemberById(id)
        );
    }


    // =====================================================
    // ADD TEAM MEMBER
    // =====================================================

    @PostMapping
    public ResponseEntity<TeamMember> addTeamMember(
            @RequestBody TeamMember teamMember
    ) {

        return ResponseEntity.ok(
                teamMemberService.addTeamMember(
                        teamMember
                )
        );
    }


    // =====================================================
    // UPDATE TEAM MEMBER
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<TeamMember> updateTeamMember(
            @PathVariable Long id,
            @RequestBody TeamMember teamMember
    ) {

        return ResponseEntity.ok(
                teamMemberService.updateTeamMember(
                        id,
                        teamMember
                )
        );
    }


    // =====================================================
    // DELETE TEAM MEMBER
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(
            @PathVariable Long id
    ) {

        teamMemberService.deleteTeamMember(id);

        return ResponseEntity.noContent().build();
    }
}