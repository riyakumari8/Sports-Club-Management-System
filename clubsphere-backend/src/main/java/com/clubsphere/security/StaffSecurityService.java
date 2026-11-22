package com.clubsphere.security;

import com.clubsphere.model.AuditLog;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.repository.AuditLogRepository;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.staff.repository.StaffPermissionRepository;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Optional;

@Component("staffSecurity")
@RequiredArgsConstructor
@Slf4j
public class StaffSecurityService {

    private final EmployeeRepository employeeRepository;
    private final StaffPermissionRepository staffPermissionRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    /**
     * Strict backend verification that the authenticated user belongs to the required department.
     * Administrators have supervisor access.
     * Non-matching staff are denied (HTTP 403) and audited for violation.
     */
    public boolean hasDepartment(Authentication auth, String requiredDepartment) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> "ROLE_ADMIN".equals(r));

        if (isAdmin) {
            return true;
        }

        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("Access denied: User not found for email {}", email);
            return false;
        }

        User user = userOpt.get();
        Optional<Employee> empOpt = employeeRepository.findByUserId(user.getId());
        if (empOpt.isEmpty()) {
            log.warn("Access denied: Employee record not found for user {}", email);
            return false;
        }

        Employee employee = empOpt.get();
        if (!"ACTIVE".equalsIgnoreCase(employee.getEmploymentStatus())) {
            log.warn("Access denied: Inactive staff member {} attempted access", email);
            return false;
        }

        if (employee.getDepartment() == null || employee.getDepartment().getCode() == null) {
            log.warn("Access denied: Staff member {} has unassigned department", email);
            return false;
        }

        String staffDeptCode = employee.getDepartment().getCode();
        if (staffDeptCode.equalsIgnoreCase(requiredDepartment)) {
            return true;
        }

        // Cross-department access violation! Record in audit log
        log.warn("DEPARTMENT ACCESS VIOLATION: Staff {} (Dept: {}) attempted unauthorized access to {}",
                employee.getEmployeeCode(), staffDeptCode, requiredDepartment);

        try {
            AuditLog auditLog = AuditLog.builder()
                    .action("UNAUTHORIZED_DEPT_ACCESS")
                    .entityName("DEPARTMENT_API")
                    .entityId(0L)
                    .performedBy(employee.getEmployeeCode() + " (" + email + ")")
                    .details("Cross-department access violation: Staff belongs to " + staffDeptCode + " but attempted " + requiredDepartment)
                    .createdAt(OffsetDateTime.now())
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception ex) {
            log.error("Failed to write audit log", ex);
        }

        return false;
    }

    /**
     * Verify granular staff permission.
     */
    public boolean hasStaffPermission(Authentication auth, String permissionCode) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> "ROLE_ADMIN".equals(r));

        if (isAdmin) {
            return true;
        }

        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        Optional<Employee> empOpt = employeeRepository.findByUserId(userOpt.get().getId());
        if (empOpt.isEmpty()) return false;

        Employee employee = empOpt.get();
        if (!"ACTIVE".equalsIgnoreCase(employee.getEmploymentStatus())) return false;

        return staffPermissionRepository.hasPermission(employee.getId(), permissionCode);
    }
}
