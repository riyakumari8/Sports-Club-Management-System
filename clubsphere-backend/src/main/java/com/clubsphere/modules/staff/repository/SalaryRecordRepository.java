package com.clubsphere.modules.staff.repository;

import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.SalaryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRecordRepository extends JpaRepository<SalaryRecord, Long> {
    Optional<SalaryRecord> findByEmployeeAndPayPeriodMonthAndPayPeriodYear(Employee employee, Integer month, Integer year);
    List<SalaryRecord> findByPayPeriodMonthAndPayPeriodYear(Integer month, Integer year);
    List<SalaryRecord> findByEmployeeOrderByPayPeriodYearDescPayPeriodMonthDesc(Employee employee);

    @Query("SELECT COALESCE(SUM(s.netSalary), 0) FROM SalaryRecord s WHERE s.payPeriodMonth = :month AND s.payPeriodYear = :year AND s.paymentStatus = 'PAID'")
    BigDecimal sumPaidSalaryForPeriod(@Param("month") Integer month, @Param("year") Integer year);
}
