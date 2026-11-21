package com.clubsphere.controller;

import com.clubsphere.dto.CourtRequestDTO;
import com.clubsphere.dto.MaintenanceRequestDTO;
import com.clubsphere.dto.SlotAvailabilityDTO;
import com.clubsphere.model.Court;
import com.clubsphere.model.CourtMaintenance;
import com.clubsphere.service.BookingService;
import com.clubsphere.service.CourtService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courts")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class CourtController {

    private final CourtService courtService;
    private final BookingService bookingService;

    public CourtController(CourtService courtService, BookingService bookingService) {
        this.courtService = courtService;
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<Court>> getCourts(
            @RequestParam(required = false) String sportType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(courtService.searchCourts(sportType, status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Court> getCourtById(@PathVariable Long id) {
        return ResponseEntity.ok(courtService.getCourtById(id));
    }

    @PostMapping
    public ResponseEntity<Court> createCourt(@Valid @RequestBody CourtRequestDTO dto) {
        return new ResponseEntity<>(courtService.createCourt(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Court> updateCourt(@PathVariable Long id, @Valid @RequestBody CourtRequestDTO dto) {
        return ResponseEntity.ok(courtService.updateCourt(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Court> updateCourtStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(courtService.updateCourtStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateCourt(@PathVariable Long id) {
        courtService.deactivateCourt(id);
        return ResponseEntity.noContent().build();
    }

    // Availability matrix for a specific court and date
    @GetMapping("/{id}/availability")
    public ResponseEntity<List<SlotAvailabilityDTO>> getCourtAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(bookingService.getCourtSlotAvailability(id, date));
    }

    // Maintenance scheduling
    @PostMapping("/{id}/maintenance")
    public ResponseEntity<CourtMaintenance> scheduleMaintenance(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceRequestDTO dto) {
        return new ResponseEntity<>(courtService.scheduleMaintenance(id, dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/maintenance")
    public ResponseEntity<List<CourtMaintenance>> getMaintenanceHistory(@PathVariable Long id) {
        return ResponseEntity.ok(courtService.getMaintenanceHistory(id));
    }
}
