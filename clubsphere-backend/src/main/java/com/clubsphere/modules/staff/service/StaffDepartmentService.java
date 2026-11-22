package com.clubsphere.modules.staff.service;

import com.clubsphere.exception.BadRequestException;
import com.clubsphere.exception.ResourceNotFoundException;
import com.clubsphere.modules.foodshop.repository.FoodIngredientRepository;
import com.clubsphere.modules.foodshop.repository.FoodOrderRepository;
import com.clubsphere.modules.foodshop.repository.FoodTableRepository;
import com.clubsphere.modules.sportsshop.repository.SportsOrderRepository;
import com.clubsphere.modules.sportsshop.repository.SportsProductRepository;
import com.clubsphere.modules.staff.entity.Attendance;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.EmployeeShift;
import com.clubsphere.modules.staff.entity.EmployeeShiftSchedule;
import com.clubsphere.modules.staff.repository.*;
import com.clubsphere.modules.user.entity.User;
import com.clubsphere.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffDepartmentService {

    private final EmployeeRepository employeeRepository;
    private final StaffPermissionRepository staffPermissionRepository;
    private final AttendanceRepository attendanceRepository;
    private final ShiftScheduleRepository shiftScheduleRepository;
    private final UserRepository userRepository;

    // Sports Shop Repositories
    private final SportsOrderRepository sportsOrderRepository;
    private final SportsProductRepository sportsProductRepository;

    // Food Shop Repositories
    private final FoodOrderRepository foodOrderRepository;
    private final FoodTableRepository foodTableRepository;
    private final FoodIngredientRepository foodIngredientRepository;

    /**
     * Resolves staff member and returns department-isolated dashboard metrics.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getStaffDashboard(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff record not found for user: " + userId));

        String deptCode = employee.getDepartment() != null && employee.getDepartment().getCode() != null
                ? employee.getDepartment().getCode().toUpperCase()
                : "GENERAL";

        LocalDate today = LocalDate.now();
        OffsetDateTime startOfDay = today.atStartOfDay().atOffset(ZoneOffset.UTC);

        // Check today's attendance
        Optional<Attendance> attendanceOpt = attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), today);
        String attendanceStatus = attendanceOpt.map(Attendance::getStatus).orElse("NOT_CHECKED_IN");
        LocalTime checkInTime = attendanceOpt.map(Attendance::getCheckInTime).orElse(null);
        LocalTime checkOutTime = attendanceOpt.map(Attendance::getCheckOutTime).orElse(null);

        // Check today's shift
        Optional<EmployeeShiftSchedule> shiftOpt = shiftScheduleRepository.findByEmployeeIdAndScheduleDate(employee.getId(), today);
        String shiftName = shiftOpt.map(s -> s.getShift().getName()).orElse("General Day Shift (09:00 - 18:00)");

        Map<String, Object> response = new HashMap<>();
        response.put("staffId", employee.getId());
        response.put("employeeCode", employee.getEmployeeCode());
        response.put("fullName", employee.getUser().getFullName());
        response.put("email", employee.getUser().getEmail());
        response.put("phone", employee.getUser().getPhone());
        response.put("designation", employee.getDesignation());
        response.put("departmentCode", deptCode);
        response.put("departmentName", employee.getDepartment() != null ? employee.getDepartment().getName() : "General Staff");
        response.put("attendanceStatus", attendanceStatus);
        response.put("checkInTime", checkInTime);
        response.put("checkOutTime", checkOutTime);
        response.put("todayShift", shiftName);
        response.put("permissions", staffPermissionRepository.findPermissionCodesByEmployeeId(employee.getId()));

        if ("SPORTS_SHOP".equalsIgnoreCase(deptCode)) {
            // Department-isolated Sports Shop metrics
            Map<String, Object> sportsMetrics = new HashMap<>();
            sportsMetrics.put("newOrders", sportsOrderRepository.countByOrderStatus("NEW"));
            sportsMetrics.put("packingOrders", sportsOrderRepository.countByOrderStatus("PACKING"));
            sportsMetrics.put("readyOrders", sportsOrderRepository.countByOrderStatus("READY_FOR_PICKUP"));
            sportsMetrics.put("completedOrders", sportsOrderRepository.countByOrderStatus("COMPLETED"));
            sportsMetrics.put("totalProducts", sportsProductRepository.countByIsActiveTrue());
            sportsMetrics.put("lowStockCount", sportsProductRepository.findLowStockProducts().size());
            sportsMetrics.put("outOfStockCount", sportsProductRepository.findOutOfStockProducts().size());
            sportsMetrics.put("todaySales", sportsOrderRepository.sumTotalSalesSince(startOfDay));
            sportsMetrics.put("allTimeSales", sportsOrderRepository.sumTotalSalesAllTime());

            response.put("metrics", sportsMetrics);
            response.put("recentOrders", sportsOrderRepository.findTop50ByOrderByCreatedAtDesc().stream().limit(6).toList());
            response.put("lowStockAlerts", sportsProductRepository.findLowStockProducts().stream().limit(5).toList());

        } else if ("FOOD_SHOP".equalsIgnoreCase(deptCode)) {
            // Department-isolated Food Shop metrics
            Map<String, Object> foodMetrics = new HashMap<>();
            foodMetrics.put("pendingOrders", foodOrderRepository.countByOrderStatus("PENDING"));
            foodMetrics.put("preparingOrders", foodOrderRepository.countByOrderStatus("PREPARING"));
            foodMetrics.put("readyOrders", foodOrderRepository.countByOrderStatus("READY"));
            foodMetrics.put("completedOrders", foodOrderRepository.countByOrderStatus("COMPLETED"));
            foodMetrics.put("occupiedTables", foodTableRepository.countByStatus("OCCUPIED"));
            foodMetrics.put("availableTables", foodTableRepository.countByStatus("AVAILABLE"));
            foodMetrics.put("totalTables", foodTableRepository.count());
            foodMetrics.put("lowStockIngredients", foodIngredientRepository.countLowStockIngredients());
            foodMetrics.put("todaySales", foodOrderRepository.sumTotalSalesSince(startOfDay));
            foodMetrics.put("allTimeSales", foodOrderRepository.sumTotalSalesAllTime());

            response.put("metrics", foodMetrics);
            response.put("recentOrders", foodOrderRepository.findTop50ByOrderByCreatedAtDesc().stream().limit(6).toList());
            response.put("lowStockIngredientsList", foodIngredientRepository.findLowStockIngredients().stream().limit(5).toList());

        } else {
            // General staff overview
            Map<String, Object> generalMetrics = new HashMap<>();
            generalMetrics.put("attendanceStatus", attendanceStatus);
            response.put("metrics", generalMetrics);
        }

        return response;
    }

    /**
     * Get staff permissions list.
     */
    @Transactional(readOnly = true)
    public List<String> getStaffPermissions(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff record not found for user: " + userId));
        return staffPermissionRepository.findPermissionCodesByEmployeeId(employee.getId());
    }

    /**
     * Update permitted personal profile fields only (phone, profilePicture, emergencyContact).
     * Staff cannot change employeeCode, department, role or salary!
     */
    @Transactional
    public Map<String, Object> updateStaffProfile(Long userId, Map<String, String> payload) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff record not found for user: " + userId));

        User user = employee.getUser();
        if (payload.containsKey("phone") && payload.get("phone") != null) {
            user.setPhone(payload.get("phone").trim());
        }
        if (payload.containsKey("address") && payload.get("address") != null) {
            user.setAddress(payload.get("address").trim());
        }
        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("employeeCode", employee.getEmployeeCode());
        res.put("fullName", user.getFullName());
        res.put("email", user.getEmail());
        res.put("phone", user.getPhone());
        res.put("address", user.getAddress());
        res.put("departmentCode", employee.getDepartment() != null ? employee.getDepartment().getCode() : "");
        res.put("departmentName", employee.getDepartment() != null ? employee.getDepartment().getName() : "");
        res.put("designation", employee.getDesignation());
        return res;
    }

    /**
     * Clock In for today with real-time timestamp.
     */
    @Transactional
    public Map<String, Object> clockIn(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff record not found for user: " + userId));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), today)
                .orElse(Attendance.builder()
                        .employee(employee)
                        .attendanceDate(today)
                        .status("PRESENT")
                        .build());

        if (attendance.getCheckInTime() != null) {
            throw new BadRequestException("You have already clocked in today at " + attendance.getCheckInTime());
        }

        attendance.setCheckInTime(now);
        attendance.setStatus("PRESENT");
        attendanceRepository.save(attendance);

        Map<String, Object> res = new HashMap<>();
        res.put("status", "PRESENT");
        res.put("checkInTime", now);
        res.put("message", "Clock-in recorded successfully at " + now.toString().substring(0, 5));
        return res;
    }

    /**
     * Clock Out for today with real-time timestamp.
     */
    @Transactional
    public Map<String, Object> clockOut(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff record not found for user: " + userId));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), today)
                .orElseThrow(() -> new BadRequestException("No clock-in record found for today. Please clock in first."));

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("You have already clocked out today at " + attendance.getCheckOutTime());
        }

        attendance.setCheckOutTime(now);
        attendanceRepository.save(attendance);

        Map<String, Object> res = new HashMap<>();
        res.put("status", attendance.getStatus());
        res.put("checkInTime", attendance.getCheckInTime());
        res.put("checkOutTime", now);
        res.put("message", "Clock-out recorded successfully at " + now.toString().substring(0, 5));
        return res;
    }

    /**
     * Get attendance history for logged in staff member.
     */
    @Transactional(readOnly = true)
    public List<Attendance> getMyAttendance(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff record not found for user: " + userId));
        return attendanceRepository.findByEmployeeIdOrderByAttendanceDateDesc(employee.getId());
    }

    /**
     * Get shifts for logged in staff member.
     */
    @Transactional(readOnly = true)
    public List<EmployeeShiftSchedule> getMyShifts(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff record not found for user: " + userId));
        return shiftScheduleRepository.findByEmployeeIdOrderByScheduleDateDesc(employee.getId());
    }
}
