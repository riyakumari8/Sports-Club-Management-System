package com.clubsphere.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Long id;
    private Long userId;
    private String employeeCode;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;
    private Integer departmentId;
    private String departmentName;
    private String departmentCode;
    private String designation;
    private LocalDate joiningDate;
    private String employmentStatus;
    private String employmentType;
    private BigDecimal baseSalary;
    private String emergencyContact;
    private String profilePicture;
    private java.util.List<String> permissions;
}
