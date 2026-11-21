




package com.clubsphere.service;

import com.clubsphere.dto.EnquiryRequestDTO;
import com.clubsphere.dto.FollowupRequestDTO;
import com.clubsphere.dto.TrialBookingRequestDTO;
import com.clubsphere.exception.BadRequestException;
import com.clubsphere.exception.ResourceNotFoundException;
import com.clubsphere.model.Court;
import com.clubsphere.model.Enquiry;
import com.clubsphere.model.EnquiryFollowup;
import com.clubsphere.model.TrialBooking;
import com.clubsphere.repository.CourtRepository;
import com.clubsphere.repository.EnquiryFollowupRepository;
import com.clubsphere.repository.EnquiryRepository;
import com.clubsphere.repository.TrialBookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final EnquiryFollowupRepository followupRepository;
    private final TrialBookingRepository trialBookingRepository;
    private final CourtRepository courtRepository;

    public EnquiryService(EnquiryRepository enquiryRepository,
                          EnquiryFollowupRepository followupRepository,
                          TrialBookingRepository trialBookingRepository,
                          CourtRepository courtRepository) {
        this.enquiryRepository = enquiryRepository;
        this.followupRepository = followupRepository;
        this.trialBookingRepository = trialBookingRepository;
        this.courtRepository = courtRepository;
    }

    public Enquiry createEnquiry(EnquiryRequestDTO dto) {
        Enquiry enquiry = new Enquiry();
        enquiry.setFullName(dto.getFullName());
        enquiry.setEmail(dto.getEmail());
        enquiry.setPhone(dto.getPhone());
        enquiry.setInterestedSport(dto.getInterestedSport());
        enquiry.setInterestedPlan(dto.getInterestedPlan());
        enquiry.setEnquiryMessage(dto.getEnquiryMessage());
        enquiry.setPreferredContactMethod(dto.getPreferredContactMethod() != null ? dto.getPreferredContactMethod() : "PHONE");
        enquiry.setStatus("NEW");

        return enquiryRepository.save(enquiry);
    }

    public List<Enquiry> searchEnquiries(String status, String sport, String search) {
        if ((status == null || status.isBlank()) &&
            (sport == null || sport.isBlank()) &&
            (search == null || search.isBlank())) {
            return enquiryRepository.findAll();
        }
        return enquiryRepository.searchEnquiries(
                (status != null && !status.isBlank()) ? status.toUpperCase() : null,
                (sport != null && !sport.isBlank()) ? sport : null,
                (search != null && !search.isBlank()) ? search : null
        );
    }

    public Enquiry getEnquiryById(Long id) {
        return enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
    }

    public Enquiry updateEnquiryStatus(Long id, String status) {
        Enquiry enquiry = getEnquiryById(id);
        enquiry.setStatus(status.toUpperCase());
        return enquiryRepository.save(enquiry);
    }

    public EnquiryFollowup addFollowup(Long enquiryId, FollowupRequestDTO dto) {
        Enquiry enquiry = getEnquiryById(enquiryId);

        EnquiryFollowup followup = new EnquiryFollowup();
        followup.setEnquiry(enquiry);
        followup.setNotes(dto.getNotes());
        followup.setNextFollowupDate(dto.getNextFollowupDate());
        followup.setCreatedByStaff(dto.getStaffName());

        if (dto.getUpdatedStatus() != null && !dto.getUpdatedStatus().isBlank()) {
            enquiry.setStatus(dto.getUpdatedStatus().toUpperCase());
        } else {
            enquiry.setStatus("CONTACTED");
        }
        enquiryRepository.save(enquiry);

        return followupRepository.save(followup);
    }

    public List<EnquiryFollowup> getEnquiryFollowups(Long enquiryId) {
        getEnquiryById(enquiryId);
        return followupRepository.findByEnquiryEnquiryIdOrderByContactDateDesc(enquiryId);
    }

    /**
     * Convert prospective enquiry into an active club member (Connecting with Riya's module).
     */
    public Enquiry convertEnquiryToMember(Long enquiryId) {
        Enquiry enquiry = getEnquiryById(enquiryId);

        if ("CONVERTED".equalsIgnoreCase(enquiry.getStatus())) {
            throw new BadRequestException("This enquiry has already been converted to Member #" + enquiry.getConvertedMemberId());
        }

        // Generate synthetic Member ID integrating with Riya's system
        Long newMemberId = 10000L + new Random().nextInt(90000);
        enquiry.setStatus("CONVERTED");
        enquiry.setConvertedMemberId(newMemberId);

        EnquiryFollowup conversionNote = new EnquiryFollowup();
        conversionNote.setEnquiry(enquiry);
        conversionNote.setNotes("Successfully converted to active member. Member ID: #" + newMemberId + 
                " assigned on tier " + (enquiry.getInterestedPlan() != null ? enquiry.getInterestedPlan() : "SILVER"));
        conversionNote.setCreatedByStaff("Membership Coordinator");
        followupRepository.save(conversionNote);

        return enquiryRepository.save(enquiry);
    }

    // Trial Booking support
    public TrialBooking createTrialBooking(TrialBookingRequestDTO dto) {
        TrialBooking trial = new TrialBooking();
        if (dto.getCourtId() != null) {
            Court court = courtRepository.findById(dto.getCourtId()).orElse(null);
            trial.setCourt(court);
        }
        trial.setFullName(dto.getFullName());
        trial.setEmail(dto.getEmail());
        trial.setPhone(dto.getPhone());
        trial.setPreferredSport(dto.getPreferredSport());
        trial.setTrialDate(dto.getTrialDate());
        trial.setStartTime(dto.getStartTime());
        trial.setEndTime(dto.getStartTime().plusHours(1));
        trial.setStatus("PENDING");

        return trialBookingRepository.save(trial);
    }

    public List<TrialBooking> getAllTrialBookings() {
        return trialBookingRepository.findAllByOrderByTrialDateDescStartTimeDesc();
    }

    public TrialBooking updateTrialStatus(Long id, String status, String notes) {
        TrialBooking trial = trialBookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trial booking not found with id: " + id));
        trial.setStatus(status.toUpperCase());
        if (notes != null) trial.setStaffNotes(notes);
        return trialBookingRepository.save(trial);
    }
}
