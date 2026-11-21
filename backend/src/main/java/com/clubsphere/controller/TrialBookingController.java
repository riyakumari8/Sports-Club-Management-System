package com.clubsphere.controller;

import com.clubsphere.dto.TrialBookingRequestDTO;
import com.clubsphere.model.TrialBooking;
import com.clubsphere.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trial-bookings")
@CrossOrigin(origins = "*")
public class TrialBookingController {

    private final EnquiryService enquiryService;

    public TrialBookingController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    public ResponseEntity<TrialBooking> requestTrial(@Valid @RequestBody TrialBookingRequestDTO dto) {
        return new ResponseEntity<>(enquiryService.createTrialBooking(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TrialBooking>> getTrials() {
        return ResponseEntity.ok(enquiryService.getAllTrialBookings());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TrialBooking> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String notes = body.get("notes");
        return ResponseEntity.ok(enquiryService.updateTrialStatus(id, status, notes));
    }
}
