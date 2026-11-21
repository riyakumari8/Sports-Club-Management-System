package com.clubsphere.modules.staff.service;

import com.clubsphere.common.exceptions.BadRequestException;
import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.modules.staff.dto.LeaveApplyRequest;
import com.clubsphere.modules.staff.dto.LeaveResponseDto;
import com.clubsphere.modules.staff.dto.LeaveReviewRequest;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.LeaveRequest;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.staff.repository.LeaveRequestRepository;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @Transactional
    public LeaveResponseDto applyLeave(Long userId, LeaveApplyRequest req) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user: " + userId));

        if (req.getEndDate().isBefore(req.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        int totalDays = (int) ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate()) + 1;

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .leaveType(req.getLeaveType().toUpperCase())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .totalDays(totalDays)
                .reason(req.getReason())
                .status("PENDING")
                .build();

        return mapToDto(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getMyLeaves(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user: " + userId));

        return leaveRequestRepository.findByEmployeeOrderByCreatedAtDesc(employee).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getAllLeaves(String status) {
        if (status != null && !status.trim().isEmpty()) {
            return leaveRequestRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase()).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }
        return leaveRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponseDto reviewLeave(Long leaveId, Long adminUserId, LeaveReviewRequest req) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveId));

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found: " + adminUserId));

        String action = req.getStatus().trim().toUpperCase();
        if (!action.equals("APPROVED") && !action.equals("REJECTED")) {
            throw new BadRequestException("Status must be APPROVED or REJECTED");
        }

        leave.setStatus(action);
        leave.setAdminRemarks(req.getAdminRemarks());
        leave.setReviewedBy(admin);
        leave.setReviewedAt(LocalDateTime.now());

        if ("APPROVED".equals(action)) {
            // Update employee status to ON_LEAVE if today is within leave dates
            Employee emp = leave.getEmployee();
            if (!emp.getEmploymentStatus().equals("TERMINATED")) {
                emp.setEmploymentStatus("ON_LEAVE");
                employeeRepository.save(emp);
            }
        }

        return mapToDto(leaveRequestRepository.save(leave));
    }

    public LeaveResponseDto mapToDto(LeaveRequest lr) {
        return LeaveResponseDto.builder()
                .id(lr.getId())
                .employeeId(lr.getEmployee().getId())
                .employeeCode(lr.getEmployee().getEmployeeCode())
                .employeeName(lr.getEmployee().getUser().getFullName())
                .departmentName(lr.getEmployee().getDepartment().getName())
                .leaveType(lr.getLeaveType())
                .startDate(lr.getStartDate())
                .endDate(lr.getEndDate())
                .totalDays(lr.getTotalDays())
                .reason(lr.getReason())
                .status(lr.getStatus())
                .adminRemarks(lr.getAdminRemarks())
                .reviewedByName(lr.getReviewedBy() != null ? lr.getReviewedBy().getFullName() : null)
                .reviewedAt(lr.getReviewedAt())
                .createdAt(lr.getCreatedAt())
                .build();
    }
}
