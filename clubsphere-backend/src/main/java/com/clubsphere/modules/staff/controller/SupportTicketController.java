package com.clubsphere.modules.staff.controller;

import com.clubsphere.common.ApiResponse;
import com.clubsphere.exception.ResourceNotFoundException;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.SupportTicket;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.staff.repository.SupportTicketRepository;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.UserRepository;
import com.clubsphere.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/staff/support")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
@Tag(name = "Staff Support", description = "Operational support tickets for staff members")
public class SupportTicketController {

    private final SupportTicketRepository supportTicketRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "List support tickets for logged-in staff member or department")
    public ResponseEntity<ApiResponse<List<SupportTicket>>> getTickets(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Employee emp = employeeRepository.findByUserId(userDetails.getId()).orElse(null);
        List<SupportTicket> list;
        if (emp != null && emp.getDepartment() != null) {
            list = supportTicketRepository.findByDepartmentCodeOrderByCreatedAtDesc(emp.getDepartment().getCode());
        } else {
            list = supportTicketRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Support tickets retrieved", list));
    }

    @PostMapping
    @Operation(summary = "Create operational support request")
    public ResponseEntity<ApiResponse<SupportTicket>> createTicket(
            @RequestBody Map<String, String> req,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Employee emp = employeeRepository.findByUserId(userDetails.getId()).orElse(null);
        String deptCode = emp != null && emp.getDepartment() != null ? emp.getDepartment().getCode() : "GENERAL";

        String ticketNumber = "TICK-" + (emp != null ? emp.getEmployeeCode() : "STF") + "-" + (100 + new Random().nextInt(900));

        SupportTicket ticket = SupportTicket.builder()
                .ticketNumber(ticketNumber)
                .user(user)
                .employee(emp)
                .departmentCode(deptCode)
                .category(req.getOrDefault("category", "OPERATIONAL"))
                .subject(req.get("subject"))
                .description(req.get("description"))
                .priority(req.getOrDefault("priority", "MEDIUM"))
                .status("OPEN")
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        SupportTicket saved = supportTicketRepository.save(ticket);
        return ResponseEntity.ok(ApiResponse.success("Support ticket created", saved));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update support ticket status")
    public ResponseEntity<ApiResponse<SupportTicket>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> req
    ) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));

        if (req.containsKey("status")) {
            ticket.setStatus(req.get("status").toUpperCase());
        }
        if (req.containsKey("adminNotes")) {
            ticket.setAdminNotes(req.get("adminNotes"));
        }
        ticket.setUpdatedAt(OffsetDateTime.now());
        return ResponseEntity.ok(ApiResponse.success("Ticket updated", supportTicketRepository.save(ticket)));
    }
}
