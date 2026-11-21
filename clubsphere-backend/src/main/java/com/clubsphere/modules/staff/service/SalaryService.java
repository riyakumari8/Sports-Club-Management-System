package com.clubsphere.modules.staff.service;

import com.clubsphere.common.exceptions.ResourceNotFoundException;
import com.clubsphere.modules.staff.dto.SalaryCreateRequest;
import com.clubsphere.modules.staff.dto.SalaryResponseDto;
import com.clubsphere.modules.staff.entity.Employee;
import com.clubsphere.modules.staff.entity.SalaryRecord;
import com.clubsphere.modules.staff.repository.EmployeeRepository;
import com.clubsphere.modules.staff.repository.SalaryRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private final SalaryRecordRepository salaryRecordRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public SalaryResponseDto createOrUpdateSalary(SalaryCreateRequest req) {
        Employee employee = employeeRepository.findById(req.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + req.getEmployeeId()));

        BigDecimal base = req.getBaseSalary() != null ? req.getBaseSalary() : employee.getBaseSalary();
        BigDecimal allowances = req.getAllowances() != null ? req.getAllowances() : BigDecimal.ZERO;
        BigDecimal deductions = req.getDeductions() != null ? req.getDeductions() : BigDecimal.ZERO;
        BigDecimal net = base.add(allowances).subtract(deductions);

        Optional<SalaryRecord> existing = salaryRecordRepository.findByEmployeeAndPayPeriodMonthAndPayPeriodYear(
                employee, req.getPayPeriodMonth(), req.getPayPeriodYear());

        SalaryRecord record;
        if (existing.isPresent()) {
            record = existing.get();
            record.setBaseSalary(base);
            record.setAllowances(allowances);
            record.setDeductions(deductions);
            record.setNetSalary(net);
            if (req.getPaymentStatus() != null) record.setPaymentStatus(req.getPaymentStatus());
            if (req.getPaymentDate() != null) record.setPaymentDate(req.getPaymentDate());
            if (req.getPaymentReference() != null) record.setPaymentReference(req.getPaymentReference());
        } else {
            record = SalaryRecord.builder()
                    .employee(employee)
                    .payPeriodMonth(req.getPayPeriodMonth())
                    .payPeriodYear(req.getPayPeriodYear())
                    .baseSalary(base)
                    .allowances(allowances)
                    .deductions(deductions)
                    .netSalary(net)
                    .paymentStatus(req.getPaymentStatus() != null ? req.getPaymentStatus() : "PENDING")
                    .paymentDate(req.getPaymentDate())
                    .paymentReference(req.getPaymentReference())
                    .build();
        }

        return mapToDto(salaryRecordRepository.save(record));
    }

    @Transactional(readOnly = true)
    public List<SalaryResponseDto> getSalaryRecordsForPeriod(Integer month, Integer year) {
        int m = (month != null) ? month : LocalDate.now().getMonthValue();
        int y = (year != null) ? year : LocalDate.now().getYear();

        return salaryRecordRepository.findByPayPeriodMonthAndPayPeriodYear(m, y).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SalaryResponseDto> getEmployeeSalaryHistory(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        return salaryRecordRepository.findByEmployeeOrderByPayPeriodYearDescPayPeriodMonthDesc(employee).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SalaryResponseDto mapToDto(SalaryRecord s) {
        return SalaryResponseDto.builder()
                .id(s.getId())
                .employeeId(s.getEmployee().getId())
                .employeeCode(s.getEmployee().getEmployeeCode())
                .employeeName(s.getEmployee().getUser().getFullName())
                .departmentName(s.getEmployee().getDepartment().getName())
                .designation(s.getEmployee().getDesignation())
                .payPeriodMonth(s.getPayPeriodMonth())
                .payPeriodYear(s.getPayPeriodYear())
                .baseSalary(s.getBaseSalary())
                .allowances(s.getAllowances())
                .deductions(s.getDeductions())
                .netSalary(s.getNetSalary())
                .paymentStatus(s.getPaymentStatus())
                .paymentDate(s.getPaymentDate())
                .paymentReference(s.getPaymentReference())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
