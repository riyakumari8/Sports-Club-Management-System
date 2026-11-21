package com.clubsphere.modules.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffDashboardStats {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long onLeaveToday;
    private long presentToday;
    private List<DepartmentDto> departmentBreakdown;
    private List<EmployeeDto> recentEmployees;
}
