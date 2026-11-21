package com.clubsphere.service;

import com.clubsphere.dto.CourtRequestDTO;
import com.clubsphere.dto.MaintenanceRequestDTO;
import com.clubsphere.exception.BadRequestException;
import com.clubsphere.exception.ResourceNotFoundException;
import com.clubsphere.model.Court;
import com.clubsphere.model.CourtMaintenance;
import com.clubsphere.repository.CourtMaintenanceRepository;
import com.clubsphere.repository.CourtRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CourtService {

    private final CourtRepository courtRepository;
    private final CourtMaintenanceRepository maintenanceRepository;

    public CourtService(CourtRepository courtRepository, CourtMaintenanceRepository maintenanceRepository) {
        this.courtRepository = courtRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    public List<Court> getAllActiveCourts() {
        return courtRepository.findByIsActiveTrue();
    }

    public List<Court> searchCourts(String sportType, String status, String search) {
        if ((sportType == null || sportType.isBlank()) &&
            (status == null || status.isBlank()) &&
            (search == null || search.isBlank())) {
            return courtRepository.findAll();
        }
        return courtRepository.searchCourts(
                (sportType != null && !sportType.isBlank()) ? sportType : null,
                (status != null && !status.isBlank()) ? status : null,
                (search != null && !search.isBlank()) ? search : null
        );
    }

    public Court getCourtById(Long courtId) {
        return courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + courtId));
    }

    public Court createCourt(CourtRequestDTO dto) {
        if (dto.getClosingTime().isBefore(dto.getOpeningTime())) {
            throw new BadRequestException("Closing time cannot be before opening time");
        }

        Court court = new Court();
        mapDtoToEntity(dto, court);
        return courtRepository.save(court);
    }

    public Court updateCourt(Long courtId, CourtRequestDTO dto) {
        Court court = getCourtById(courtId);
        if (dto.getClosingTime().isBefore(dto.getOpeningTime())) {
            throw new BadRequestException("Closing time cannot be before opening time");
        }
        mapDtoToEntity(dto, court);
        return courtRepository.save(court);
    }

    public Court updateCourtStatus(Long courtId, String status) {
        Court court = getCourtById(courtId);
        court.setCourtStatus(status.toUpperCase());
        return courtRepository.save(court);
    }

    public void deactivateCourt(Long courtId) {
        Court court = getCourtById(courtId);
        court.setIsActive(false);
        courtRepository.save(court);
    }

    // Maintenance scheduling
    public CourtMaintenance scheduleMaintenance(Long courtId, MaintenanceRequestDTO dto) {
        Court court = getCourtById(courtId);
        if (dto.getEndTime().isBefore(dto.getStartTime())) {
            throw new BadRequestException("Maintenance end time cannot be before start time");
        }

        CourtMaintenance maintenance = new CourtMaintenance();
        maintenance.setCourt(court);
        maintenance.setStartTime(dto.getStartTime());
        maintenance.setEndTime(dto.getEndTime());
        maintenance.setReason(dto.getReason());
        maintenance.setCreatedBy(dto.getCreatedBy());

        // Update court status to UNDER_MAINTENANCE if currently in maintenance window
        court.setCourtStatus("UNDER_MAINTENANCE");
        courtRepository.save(court);

        return maintenanceRepository.save(maintenance);
    }

    public List<CourtMaintenance> getMaintenanceHistory(Long courtId) {
        getCourtById(courtId); // ensure court exists
        return maintenanceRepository.findByCourtCourtIdOrderByStartTimeDesc(courtId);
    }

    private void mapDtoToEntity(CourtRequestDTO dto, Court court) {
        court.setCourtName(dto.getCourtName());
        court.setSportType(dto.getSportType().toUpperCase());
        court.setCourtDescription(dto.getCourtDescription());
        court.setLocation(dto.getLocation());
        court.setSurfaceType(dto.getSurfaceType());
        if (dto.getCapacity() != null) court.setCapacity(dto.getCapacity());
        court.setOpeningTime(dto.getOpeningTime());
        court.setClosingTime(dto.getClosingTime());
        court.setStandardHourlyRate(dto.getStandardHourlyRate());
        court.setGuestHourlyRate(dto.getGuestHourlyRate());
        if (dto.getCourtStatus() != null) court.setCourtStatus(dto.getCourtStatus().toUpperCase());
        if (dto.getIsActive() != null) court.setIsActive(dto.getIsActive());
        if (dto.getImageUrl() != null) court.setImageUrl(dto.getImageUrl());
    }
}
