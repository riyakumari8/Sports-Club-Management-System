package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.Attendance;
import com.clubsphere.modules.staff.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeAndAttendanceDate(Employee employee, LocalDate attendanceDate);
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate attendanceDate);
    List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(Long employeeId);
    List<Attendance> findByEmployeeAndAttendanceDateBetweenOrderByAttendanceDateDesc(Employee employee, LocalDate start, LocalDate end);
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date AND a.status = 'PRESENT'")
    long countPresentOnDate(@Param("date") LocalDate date);
}
