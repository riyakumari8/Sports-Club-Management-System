package com.clubsphere.controller;

import com.clubsphere.dto.EnquiryRequestDTO;
import com.clubsphere.dto.FollowupRequestDTO;
import com.clubsphere.model.Enquiry;
import com.clubsphere.model.EnquiryFollowup;
import com.clubsphere.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "*")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    public ResponseEntity<Enquiry> submitEnquiry(@Valid @RequestBody EnquiryRequestDTO dto) {
        return new ResponseEntity<>(enquiryService.createEnquiry(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Enquiry>> getEnquiries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sport,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(enquiryService.searchEnquiries(status, sport, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enquiry> getEnquiryById(@PathVariable Long id) {
        return ResponseEntity.ok(enquiryService.getEnquiryById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Enquiry> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(enquiryService.updateEnquiryStatus(id, status));
    }

    @PostMapping("/{id}/followups")
    public ResponseEntity<EnquiryFollowup> addFollowup(
            @PathVariable Long id,
            @Valid @RequestBody FollowupRequestDTO dto) {
        return new ResponseEntity<>(enquiryService.addFollowup(id, dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/followups")
    public ResponseEntity<List<EnquiryFollowup>> getFollowups(@PathVariable Long id) {
        return ResponseEntity.ok(enquiryService.getEnquiryFollowups(id));
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<Enquiry> convertToMember(@PathVariable Long id) {
        return ResponseEntity.ok(enquiryService.convertEnquiryToMember(id));
    }
}
