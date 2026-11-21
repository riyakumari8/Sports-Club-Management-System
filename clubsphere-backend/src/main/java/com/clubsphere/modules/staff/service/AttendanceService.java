package com.clubsphere.modules.staff.service;

import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.modules.staff.dto.AttendanceMarkRequest;
import com.clubsphere.modules.staff.dto.AttendanceResponseDto;
import com.clubsphere.modules.staff.entity.Attendance;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.repository.AttendanceRepository;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public AttendanceResponseDto markAttendance(AttendanceMarkRequest req) {
        Employee employee = employeeRepository.findById(req.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + req.getEmployeeId()));

        Optional<Attendance> existing = attendanceRepository.findByEmployeeAndAttendanceDate(employee, req.getAttendanceDate());
        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(req.getStatus().toUpperCase());
            if (req.getCheckInTime() != null) attendance.setCheckInTime(req.getCheckInTime());
            if (req.getCheckOutTime() != null) attendance.setCheckOutTime(req.getCheckOutTime());
            if (req.getRemarks() != null) attendance.setRemarks(req.getRemarks());
        } else {
            attendance = Attendance.builder()
                    .employee(employee)
                    .attendanceDate(req.getAttendanceDate())
                    .status(req.getStatus().toUpperCase())
                    .checkInTime(req.getCheckInTime())
                    .checkOutTime(req.getCheckOutTime())
                    .remarks(req.getRemarks())
                    .build();
        }

        return mapToDto(attendanceRepository.save(attendance));
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponseDto> getEmployeeAttendanceHistory(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusDays(30);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();

        return attendanceRepository.findByEmployeeAndAttendanceDateBetweenOrderByAttendanceDateDesc(employee, start, end).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponseDto> getDailyAttendance(LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return attendanceRepository.findByAttendanceDate(queryDate).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AttendanceResponseDto mapToDto(Attendance a) {
        return AttendanceResponseDto.builder()
                .id(a.getId())
                .employeeId(a.getEmployee().getId())
                .employeeCode(a.getEmployee().getEmployeeCode())
                .employeeName(a.getEmployee().getUser().getFullName())
                .departmentName(a.getEmployee().getDepartment().getName())
                .attendanceDate(a.getAttendanceDate())
                .status(a.getStatus())
                .checkInTime(a.getCheckInTime())
                .checkOutTime(a.getCheckOutTime())
                .remarks(a.getRemarks())
                .build();
    }
}
