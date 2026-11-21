package com.clubsphere.controller;

import com.clubsphere.dto.SocialPlayCreateDTO;
import com.clubsphere.model.SocialPlayParticipant;
import com.clubsphere.model.SocialPlaySession;
import com.clubsphere.service.SocialPlayService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/social-play")
@CrossOrigin(origins = "*")
public class SocialPlayController {

    private final SocialPlayService socialPlayService;

    public SocialPlayController(SocialPlayService socialPlayService) {
        this.socialPlayService = socialPlayService;
    }

    @GetMapping
    public ResponseEntity<List<SocialPlaySession>> getUpcomingSessions() {
        return ResponseEntity.ok(socialPlayService.getUpcomingSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocialPlaySession> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(socialPlayService.getSessionById(id));
    }

    @PostMapping
    public ResponseEntity<SocialPlaySession> createSession(@Valid @RequestBody SocialPlayCreateDTO dto) {
        return new ResponseEntity<>(socialPlayService.createSession(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<SocialPlayParticipant>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(socialPlayService.getSessionParticipants(id));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<SocialPlayParticipant> joinSession(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Long memberId = body.get("memberId") != null ? Long.valueOf(body.get("memberId").toString()) : null;
        String name = body.getOrDefault("participantName", "Club Player").toString();
        String email = body.getOrDefault("participantEmail", "").toString();

        return new ResponseEntity<>(
                socialPlayService.joinSession(id, memberId, name, email),
                HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{id}/leave/{participantId}")
    public ResponseEntity<Void> leaveSession(@PathVariable Long id, @PathVariable Long participantId) {
        socialPlayService.leaveSession(id, participantId);
        return ResponseEntity.noContent().build();
    }
}
