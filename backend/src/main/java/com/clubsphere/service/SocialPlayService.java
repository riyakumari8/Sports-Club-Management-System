package com.clubsphere.service;

import com.clubsphere.dto.SocialPlayCreateDTO;
import com.clubsphere.exception.BadRequestException;
import com.clubsphere.exception.ConflictException;
import com.clubsphere.exception.ResourceNotFoundException;
import com.clubsphere.model.Court;
import com.clubsphere.model.CourtBooking;
import com.clubsphere.model.SocialPlayParticipant;
import com.clubsphere.model.SocialPlaySession;
import com.clubsphere.repository.CourtBookingRepository;
import com.clubsphere.repository.CourtRepository;
import com.clubsphere.repository.SocialPlayParticipantRepository;
import com.clubsphere.repository.SocialPlaySessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class SocialPlayService {

    private final SocialPlaySessionRepository sessionRepository;
    private final SocialPlayParticipantRepository participantRepository;
    private final CourtRepository courtRepository;
    private final CourtBookingRepository bookingRepository;

    public SocialPlayService(SocialPlaySessionRepository sessionRepository,
                             SocialPlayParticipantRepository participantRepository,
                             CourtRepository courtRepository,
                             CourtBookingRepository bookingRepository) {
        this.sessionRepository = sessionRepository;
        this.participantRepository = participantRepository;
        this.courtRepository = courtRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<SocialPlaySession> getUpcomingSessions() {
        return sessionRepository.findBySessionDateGreaterThanEqualOrderBySessionDateAscStartTimeAsc(LocalDate.now());
    }

    public SocialPlaySession getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Social play session not found with id: " + sessionId));
    }

    public SocialPlaySession createSession(SocialPlayCreateDTO dto) {
        Court court = courtRepository.findById(dto.getCourtId())
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + dto.getCourtId()));

        if (dto.getEndTime().isBefore(dto.getStartTime())) {
            throw new BadRequestException("Session end time cannot be before start time");
        }

        // Check if court has existing regular bookings during this time block
        List<CourtBooking> conflicts = bookingRepository.findOverlappingBookings(
                court.getCourtId(), dto.getSessionDate(), dto.getStartTime(), dto.getEndTime(), null);
        if (!conflicts.isEmpty()) {
            throw new ConflictException("Cannot host Friday Social Play: The court already has a confirmed regular booking during this period.");
        }

        // Check if court already has another social session scheduled
        List<SocialPlaySession> existingSessions = sessionRepository.findOverlappingSessions(
                court.getCourtId(), dto.getSessionDate(), dto.getStartTime(), dto.getEndTime());
        if (!existingSessions.isEmpty()) {
            throw new ConflictException("Another social play session is already scheduled on this court during this time.");
        }

        SocialPlaySession session = new SocialPlaySession();
        session.setCourt(court);
        session.setTitle(dto.getTitle());
        session.setSessionDate(dto.getSessionDate());
        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setMaxParticipants(dto.getMaxParticipants());
        session.setCurrentParticipants(0);
        session.setEntryFee(dto.getEntryFee());
        session.setSessionStatus("OPEN");

        return sessionRepository.save(session);
    }

    public SocialPlayParticipant joinSession(Long sessionId, Long memberId, String participantName, String participantEmail) {
        SocialPlaySession session = getSessionById(sessionId);

        if ("FULL".equalsIgnoreCase(session.getSessionStatus()) ||
                session.getCurrentParticipants() >= session.getMaxParticipants()) {
            throw new BadRequestException("This social play session has reached full capacity (" + session.getMaxParticipants() + " players).");
        }

        if ("CANCELLED".equalsIgnoreCase(session.getSessionStatus())) {
            throw new BadRequestException("Cannot join a cancelled session.");
        }

        // Prevent duplicate registration
        if (memberId != null) {
            participantRepository.findBySessionSessionIdAndMemberId(sessionId, memberId).ifPresent(p -> {
                throw new ConflictException("You are already registered for this social play session.");
            });
        }

        SocialPlayParticipant participant = new SocialPlayParticipant();
        participant.setSession(session);
        participant.setMemberId(memberId);
        participant.setParticipantName(participantName);
        participant.setParticipantEmail(participantEmail);
        participant.setPaymentStatus("PAID");

        SocialPlayParticipant saved = participantRepository.save(participant);

        // Update count & status
        session.setCurrentParticipants(session.getCurrentParticipants() + 1);
        if (session.getCurrentParticipants() >= session.getMaxParticipants()) {
            session.setSessionStatus("FULL");
        }
        sessionRepository.save(session);

        return saved;
    }

    public void leaveSession(Long sessionId, Long participantId) {
        SocialPlaySession session = getSessionById(sessionId);
        SocialPlayParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant registration not found with id: " + participantId));

        participantRepository.delete(participant);

        session.setCurrentParticipants(Math.max(0, session.getCurrentParticipants() - 1));
        if (session.getCurrentParticipants() < session.getMaxParticipants() && !"CANCELLED".equalsIgnoreCase(session.getSessionStatus())) {
            session.setSessionStatus("OPEN");
        }
        sessionRepository.save(session);
    }

    public List<SocialPlayParticipant> getSessionParticipants(Long sessionId) {
        getSessionById(sessionId); // ensure session exists
        return participantRepository.findBySessionSessionId(sessionId);
    }
}
