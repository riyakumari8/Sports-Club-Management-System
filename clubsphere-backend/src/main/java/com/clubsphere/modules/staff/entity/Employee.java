package com.clubsphere.modules.staff.entity;

import com.clubsphere.common.BaseEntity;
import com.clubsphere.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode; // e.g. CS-EMP-001

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Column(name = "employment_status", nullable = false, length = 30)
    @Builder.Default
    private String employmentStatus = "ACTIVE"; // ACTIVE, INACTIVE, ON_LEAVE, TERMINATED

    @Column(name = "employment_type", nullable = false, length = 30)
    @Builder.Default
    private String employmentType = "FULL_TIME"; // FULL_TIME, PART_TIME, CONTRACT

    @Column(name = "base_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseSalary;
}
