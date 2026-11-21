package com.clubsphere.repository;

import com.clubsphere.model.SocialPlayParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialPlayParticipantRepository extends JpaRepository<SocialPlayParticipant, Long> {

    List<SocialPlayParticipant> findBySessionSessionId(Long sessionId);

    Optional<SocialPlayParticipant> findBySessionSessionIdAndParticipantName(Long sessionId, String participantName);

    Optional<SocialPlayParticipant> findBySessionSessionIdAndMemberId(Long sessionId, Long memberId);
}
