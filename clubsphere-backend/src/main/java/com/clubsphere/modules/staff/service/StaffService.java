package com.clubsphere.modules.staff.service;

import com.clubsphere.common.exceptions.BadRequestException;
import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.modules.staff.dto.*;
import com.clubsphere.modules.staff.entity.Department;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.repository.AttendanceRepository;
import com.clubsphere.modules.staff.repository.DepartmentRepository;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.staff.repository.LeaveRequestRepository;
import com.clubsphere.modules.user.entity.ERole;
import com.clubsphere.modules.user.entity.Role;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.RoleRepository;
import com.clubsphere.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<EmployeeDto> searchEmployees(String query, Integer departmentId, String status) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanStatus = (status != null && !status.trim().isEmpty()) ? status.trim().toUpperCase() : null;

        return employeeRepository.searchEmployees(cleanQuery, departmentId, cleanStatus).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        return mapToDto(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user: " + userId));
        return mapToDto(employee);
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeCreateRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " already exists");
        }

        Department department = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + req.getDepartmentId()));

        Role staffRole = roleRepository.findByName(ERole.ROLE_STAFF)
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_STAFF not found"));

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .phone(req.getPhone().trim())
                .address(req.getAddress())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .status("ACTIVE")
                .roles(new HashSet<>(Collections.singletonList(staffRole)))
                .build();
        user = userRepository.save(user);

        long count = employeeRepository.count() + 1;
        String empCode = String.format("CS-EMP-%03d", count);

        Employee employee = Employee.builder()
                .user(user)
                .employeeCode(empCode)
                .department(department)
                .designation(req.getDesignation().trim())
                .joiningDate(req.getJoiningDate())
                .employmentStatus("ACTIVE")
                .employmentType(req.getEmploymentType() != null ? req.getEmploymentType() : "FULL_TIME")
                .baseSalary(req.getBaseSalary())
                .build();

        return mapToDto(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeUpdateRequest req) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));

        User user = employee.getUser();
        user.setFullName(req.getFullName().trim());
        if (req.getPhone() != null) user.setPhone(req.getPhone().trim());
        if (req.getAddress() != null) user.setAddress(req.getAddress());
        if (req.getDateOfBirth() != null) user.setDateOfBirth(req.getDateOfBirth());
        if (req.getGender() != null) user.setGender(req.getGender());
        userRepository.save(user);

        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + req.getDepartmentId()));
            employee.setDepartment(dept);
        }

        if (req.getDesignation() != null) employee.setDesignation(req.getDesignation().trim());
        if (req.getEmploymentStatus() != null) employee.setEmploymentStatus(req.getEmploymentStatus().toUpperCase());
        if (req.getEmploymentType() != null) employee.setEmploymentType(req.getEmploymentType());
        if (req.getBaseSalary() != null) employee.setBaseSalary(req.getBaseSalary());

        return mapToDto(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeDto updateStatus(Long id, String status) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));

        employee.setEmploymentStatus(status.toUpperCase());
        return mapToDto(employeeRepository.save(employee));
    }

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> DepartmentDto.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .description(d.getDescription())
                        .isActive(d.getIsActive())
                        .employeeCount(employeeRepository.countByDepartmentId(d.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StaffDashboardStats getDashboardStats() {
        long total = employeeRepository.count();
        long active = employeeRepository.countByEmploymentStatus("ACTIVE");
        long inactive = employeeRepository.countByEmploymentStatus("INACTIVE");
        long onLeave = leaveRequestRepository.countEmployeesOnLeaveToday(LocalDate.now());
        long present = attendanceRepository.countPresentOnDate(LocalDate.now());

        List<DepartmentDto> deptList = getAllDepartments();
        List<EmployeeDto> recents = employeeRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return StaffDashboardStats.builder()
                .totalEmployees(total)
                .activeEmployees(active)
                .inactiveEmployees(inactive)
                .onLeaveToday(onLeave)
                .presentToday(present)
                .departmentBreakdown(deptList)
                .recentEmployees(recents)
                .build();
    }

    public EmployeeDto mapToDto(Employee e) {
        return EmployeeDto.builder()
                .id(e.getId())
                .userId(e.getUser().getId())
                .employeeCode(e.getEmployeeCode())
                .fullName(e.getUser().getFullName())
                .email(e.getUser().getEmail())
                .phone(e.getUser().getPhone())
                .address(e.getUser().getAddress())
                .dateOfBirth(e.getUser().getDateOfBirth())
                .gender(e.getUser().getGender())
                .departmentId(e.getDepartment().getId())
                .departmentName(e.getDepartment().getName())
                .designation(e.getDesignation())
                .joiningDate(e.getJoiningDate())
                .employmentStatus(e.getEmploymentStatus())
                .employmentType(e.getEmploymentType())
                .baseSalary(e.getBaseSalary())
                .build();
    }
}
