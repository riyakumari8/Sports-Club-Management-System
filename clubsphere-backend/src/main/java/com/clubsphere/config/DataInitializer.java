package com.clubsphere.config;

import com.clubsphere.modules.membership.entity.Member;
import com.clubsphere.modules.membership.entity.Membership;
import com.clubsphere.modules.membership.entity.MembershipPlan;
import com.clubsphere.modules.membership.entity.MembershipTransaction;
import com.clubsphere.modules.membership.repository.MemberRepository;
import com.clubsphere.modules.membership.repository.MembershipPlanRepository;
import com.clubsphere.modules.membership.repository.MembershipRepository;
import com.clubsphere.modules.membership.repository.MembershipTransactionRepository;
import com.clubsphere.modules.staff.entity.Department;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.EmployeeShift;
import com.clubsphere.modules.staff.repository.DepartmentRepository;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.staff.repository.EmployeeShiftRepository;
import com.clubsphere.modules.user.entity.ERole;
import com.clubsphere.modules.user.entity.Role;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.RoleRepository;
import com.clubsphere.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final MembershipPlanRepository planRepository;
    private final MemberRepository memberRepository;
    private final MembershipRepository membershipRepository;
    private final MembershipTransactionRepository transactionRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeShiftRepository shiftRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        initRoles();
        initDepartments();
        initShifts();
        initPlans();
        initAdminUser();
        initSampleStaff();
        initSampleMembers();
    }

    private void initRoles() {
        for (ERole eRole : ERole.values()) {
            if (roleRepository.findByName(eRole).isEmpty()) {
                roleRepository.save(Role.builder()
                        .name(eRole)
                        .description("Role " + eRole.name())
                        .build());
            }
        }
    }

    private void initDepartments() {
        List<String> depts = List.of(
                "Administration", "Sports Coaching", "Court Operations", "Cafe & Bar", "Facility & Maintenance"
        );
        for (String name : depts) {
            if (departmentRepository.findByName(name).isEmpty()) {
                departmentRepository.save(Department.builder()
                        .name(name)
                        .description(name + " department")
                        .isActive(true)
                        .build());
            }
        }
    }

    private void initShifts() {
        if (shiftRepository.count() == 0) {
            shiftRepository.save(EmployeeShift.builder()
                    .name("Morning Shift")
                    .startTime(LocalTime.of(6, 0))
                    .endTime(LocalTime.of(14, 0))
                    .description("Morning coaching and court prep")
                    .build());
            shiftRepository.save(EmployeeShift.builder()
                    .name("Evening Shift")
                    .startTime(LocalTime.of(14, 0))
                    .endTime(LocalTime.of(22, 0))
                    .description("Evening matches and dining hours")
                    .build());
            shiftRepository.save(EmployeeShift.builder()
                    .name("General Shift")
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(18, 0))
                    .description("Administrative day operations")
                    .build());
        }
    }

    private void initPlans() {
        if (planRepository.findByPlanCode("GOLD-YR").isEmpty()) {
            planRepository.save(MembershipPlan.builder()
                    .planCode("GOLD-YR")
                    .name("Gold Membership")
                    .category("GOLD")
                    .description("Full VIP club access, free court bookings, top tier shop & cafe discounts")
                    .price(new BigDecimal("15000.00"))
                    .durationDays(365)
                    .benefits("[\"Unlimited Court Access\", \"Priority 7-Day Advance Booking\", \"15% Shop Discount\", \"10% Cafe Discount\", \"Locker Service\"]")
                    .isActive(true)
                    .build());
        }
        if (planRepository.findByPlanCode("SILVER-HY").isEmpty()) {
            planRepository.save(MembershipPlan.builder()
                    .planCode("SILVER-HY")
                    .name("Silver Membership")
                    .category("SILVER")
                    .description("Standard court access, fitness center privileges, and club discounts")
                    .price(new BigDecimal("8000.00"))
                    .durationDays(180)
                    .benefits("[\"Regular Court Access\", \"3-Day Advance Booking\", \"10% Shop Discount\", \"5% Cafe Discount\"]")
                    .isActive(true)
                    .build());
        }
        if (planRepository.findByPlanCode("JUNIOR-YR").isEmpty()) {
            planRepository.save(MembershipPlan.builder()
                    .planCode("JUNIOR-YR")
                    .name("Junior Membership")
                    .category("JUNIOR")
                    .description("Special discounted youth membership for young athletes under 18 years")
                    .price(new BigDecimal("5000.00"))
                    .durationDays(365)
                    .minAge(5)
                    .maxAge(17)
                    .benefits("[\"Junior Coaching Access\", \"Weekend Morning Courts\", \"5% Shop Discount\", \"Tournament Eligibility\"]")
                    .isActive(true)
                    .build());
        }
    }

    private void initAdminUser() {
        String adminEmail = "admin@clubsphere.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow();
            Role staffRole = roleRepository.findByName(ERole.ROLE_STAFF).orElseThrow();
            Role memberRole = roleRepository.findByName(ERole.ROLE_MEMBER).orElseThrow();

            User admin = User.builder()
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .fullName("Riya Administrator")
                    .phone("+91 9876543210")
                    .address("ClubSphere Headquarters, Sports Complex Road")
                    .dateOfBirth(LocalDate.of(2000, 1, 15))
                    .gender("Female")
                    .status("ACTIVE")
                    .roles(new HashSet<>(Arrays.asList(adminRole, staffRole, memberRole)))
                    .build();
            userRepository.save(admin);
        }
    }

    private void initSampleStaff() {
        String staffEmail = "coach.rahul@clubsphere.com";
        if (userRepository.findByEmail(staffEmail).isEmpty()) {
            Role staffRole = roleRepository.findByName(ERole.ROLE_STAFF).orElseThrow();
            Department dept = departmentRepository.findByName("Sports Coaching").orElse(null);

            User staffUser = User.builder()
                    .email(staffEmail)
                    .passwordHash(passwordEncoder.encode("Staff@123"))
                    .fullName("Rahul Verma")
                    .phone("+91 9811223344")
                    .address("14 Green Park Avenue, New Delhi")
                    .dateOfBirth(LocalDate.of(1995, 6, 20))
                    .gender("Male")
                    .status("ACTIVE")
                    .roles(new HashSet<>(Collections.singletonList(staffRole)))
                    .build();
            staffUser = userRepository.save(staffUser);

            if (dept != null) {
                Employee emp = Employee.builder()
                        .user(staffUser)
                        .employeeCode("CS-EMP-001")
                        .department(dept)
                        .designation("Head Tennis Coach")
                        .joiningDate(LocalDate.of(2023, 3, 1))
                        .employmentStatus("ACTIVE")
                        .employmentType("FULL_TIME")
                        .baseSalary(new BigDecimal("45000.00"))
                        .build();
                employeeRepository.save(emp);
            }
        }
    }

    private void initSampleMembers() {
        // Sample Adult Member Vikram
        String memberEmail = "vikram.singh@example.com";
        if (userRepository.findByEmail(memberEmail).isEmpty()) {
            Role memberRole = roleRepository.findByName(ERole.ROLE_MEMBER).orElseThrow();

            User memUser = User.builder()
                    .email(memberEmail)
                    .passwordHash(passwordEncoder.encode("Member@123"))
                    .fullName("Vikram Singh")
                    .phone("+91 9711223344")
                    .address("Sector 42, Golf Course Road, Gurugram")
                    .dateOfBirth(LocalDate.of(1992, 8, 10))
                    .gender("Male")
                    .status("ACTIVE")
                    .roles(new HashSet<>(Collections.singletonList(memberRole)))
                    .build();
            memUser = userRepository.save(memUser);

            Member member = Member.builder()
                    .user(memUser)
                    .memberCode("CS-MB-2026-0001")
                    .emergencyContactName("Pooja Singh")
                    .emergencyContactPhone("+91 9711223355")
                    .bloodGroup("O+")
                    .status("ACTIVE")
                    .build();
            member = memberRepository.save(member);

            MembershipPlan goldPlan = planRepository.findByPlanCode("GOLD-YR").orElse(null);
            if (goldPlan != null) {
                Membership membership = Membership.builder()
                        .member(member)
                        .plan(goldPlan)
                        .membershipNumber("CS-MEM-2026-00101")
                        .startDate(LocalDate.now().minusDays(15))
                        .endDate(LocalDate.now().plusDays(350))
                        .status("ACTIVE")
                        .qrCodeToken("CS-QR-VIKRAM-SINGH-" + UUID.randomUUID())
                        .autoRenew(true)
                        .build();
                membership = membershipRepository.save(membership);

                transactionRepository.save(MembershipTransaction.builder()
                        .membership(membership)
                        .member(member)
                        .transactionType("NEW_REGISTRATION")
                        .amount(goldPlan.getPrice())
                        .paymentMethod("UPI")
                        .paymentStatus("PAID")
                        .transactionReference("TXN-SEED-001")
                        .paidAt(LocalDateTime.now().minusDays(15))
                        .build());
            }
        }

        // Sample Junior Member Aarav (15 years old)
        String juniorEmail = "aarav.mehta@example.com";
        if (userRepository.findByEmail(juniorEmail).isEmpty()) {
            Role memberRole = roleRepository.findByName(ERole.ROLE_MEMBER).orElseThrow();

            User juniorUser = User.builder()
                    .email(juniorEmail)
                    .passwordHash(passwordEncoder.encode("Member@123"))
                    .fullName("Aarav Mehta")
                    .phone("+91 9988776655")
                    .address("22 Vasant Kunj, New Delhi")
                    .dateOfBirth(LocalDate.now().minusYears(15).minusMonths(2))
                    .gender("Male")
                    .status("ACTIVE")
                    .roles(new HashSet<>(Collections.singletonList(memberRole)))
                    .build();
            juniorUser = userRepository.save(juniorUser);

            Member juniorMember = Member.builder()
                    .user(juniorUser)
                    .memberCode("CS-MB-2026-0002")
                    .emergencyContactName("Sunita Mehta (Mother)")
                    .emergencyContactPhone("+91 9988776600")
                    .bloodGroup("B+")
                    .status("ACTIVE")
                    .build();
            juniorMember = memberRepository.save(juniorMember);

            MembershipPlan juniorPlan = planRepository.findByPlanCode("JUNIOR-YR").orElse(null);
            if (juniorPlan != null) {
                Membership membership = Membership.builder()
                        .member(juniorMember)
                        .plan(juniorPlan)
                        .membershipNumber("CS-MEM-2026-00102")
                        .startDate(LocalDate.now().minusDays(30))
                        .endDate(LocalDate.now().plusDays(335))
                        .status("ACTIVE")
                        .qrCodeToken("CS-QR-AARAV-MEHTA-" + UUID.randomUUID())
                        .autoRenew(false)
                        .build();
                membership = membershipRepository.save(membership);

                transactionRepository.save(MembershipTransaction.builder()
                        .membership(membership)
                        .member(juniorMember)
                        .transactionType("NEW_REGISTRATION")
                        .amount(juniorPlan.getPrice())
                        .paymentMethod("CREDIT_CARD")
                        .paymentStatus("PAID")
                        .transactionReference("TXN-SEED-002")
                        .paidAt(LocalDateTime.now().minusDays(30))
                        .build());
            }
        }
    }
}
