package com.clubsphere.modules.staff.service;

import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.modules.staff.dto.ShiftAssignRequest;
import com.clubsphere.modules.staff.dto.ShiftDto;
import com.clubsphere.modules.staff.dto.ShiftScheduleResponseDto;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.EmployeeShift;
import com.clubsphere.modules.staff.entity.EmployeeShiftSchedule;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.staff.repository.EmployeeShiftRepository;
import com.clubsphere.modules.staff.repository.ShiftScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftService {

    private final EmployeeShiftRepository shiftRepository;
    private final ShiftScheduleRepository scheduleRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<ShiftDto> getAllShifts() {
        return shiftRepository.findAll().stream()
                .map(s -> ShiftDto.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .description(s.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public ShiftScheduleResponseDto assignShift(ShiftAssignRequest req) {
        Employee employee = employeeRepository.findById(req.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + req.getEmployeeId()));

        EmployeeShift shift = shiftRepository.findById(req.getShiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found: " + req.getShiftId()));

        EmployeeShiftSchedule schedule = EmployeeShiftSchedule.builder()
                .employee(employee)
                .shift(shift)
                .scheduleDate(req.getScheduleDate())
                .status("SCHEDULED")
                .build();

        schedule = scheduleRepository.save(schedule);

        return ShiftScheduleResponseDto.builder()
                .id(schedule.getId())
                .employeeId(employee.getId())
                .employeeName(employee.getUser().getFullName())
                .shiftId(shift.getId())
                .shiftName(shift.getName())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .scheduleDate(schedule.getScheduleDate())
                .status(schedule.getStatus())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ShiftScheduleResponseDto> getDailySchedules(LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return scheduleRepository.findByScheduleDate(queryDate).stream()
                .map(s -> ShiftScheduleResponseDto.builder()
                        .id(s.getId())
                        .employeeId(s.getEmployee().getId())
                        .employeeName(s.getEmployee().getUser().getFullName())
                        .shiftId(s.getShift().getId())
                        .shiftName(s.getShift().getName())
                        .startTime(s.getShift().getStartTime())
                        .endTime(s.getShift().getEndTime())
                        .scheduleDate(s.getScheduleDate())
                        .status(s.getStatus())
                        .build())
                .collect(Collectors.toList());
    }
}
